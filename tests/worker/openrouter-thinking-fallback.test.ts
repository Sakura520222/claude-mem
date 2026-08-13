// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it, beforeEach, afterEach, mock } from 'bun:test';
import {
  isThinkingUnsupportedError,
  thinkingUnsupportedHosts,
  OpenRouterProvider,
} from '../../src/services/worker/OpenRouterProvider';
import type { DatabaseManager } from '../../src/services/worker/DatabaseManager';
import type { SessionManager } from '../../src/services/worker/SessionManager';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

describe('isThinkingUnsupportedError', () => {
  it('matches Groq-style "property thinking is unsupported" 400', () => {
    expect(isThinkingUnsupportedError(400, JSON.stringify({
      error: { message: "property 'thinking' is unsupported", type: 'invalid_request_error' },
    }))).toBe(true);
  });

  it('matches "thinking" + unrecognized/unknown argument variants', () => {
    expect(isThinkingUnsupportedError(400, 'unknown parameter: thinking')).toBe(true);
    expect(isThinkingUnsupportedError(400, 'unrecognized request argument supplied: thinking')).toBe(true);
  });

  it('returns false for non-400 status', () => {
    expect(isThinkingUnsupportedError(200, 'thinking unsupported')).toBe(false);
    expect(isThinkingUnsupportedError(500, 'thinking unsupported')).toBe(false);
  });

  it('returns false for a 400 unrelated to thinking', () => {
    expect(isThinkingUnsupportedError(400, '{"error":{"message":"invalid api key"}}')).toBe(false);
  });

  it('returns false when the body omits "thinking" entirely', () => {
    expect(isThinkingUnsupportedError(400, 'unsupported model')).toBe(false);
  });
});

describe('OpenRouterProvider thinking.type fallback', () => {
  let agent: OpenRouterProvider;
  let originalFetch: typeof global.fetch;
  let bodies: Array<Record<string, unknown>>;

  beforeEach(() => {
    thinkingUnsupportedHosts.clear();
    bodies = [];
    originalFetch = global.fetch;
    // Minimal stubs: fetchWithThinkingFallback only reaches global.fetch via
    // fetchChatCompletion, which touches no instance state.
    agent = new OpenRouterProvider(
      {} as unknown as DatabaseManager,
      {} as unknown as SessionManager,
    );
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  /** Count calls, capture the JSON body, and return canned responses in order. */
  function sequence(responses: Array<{ status: number; body: unknown }>) {
    let call = 0;
    global.fetch = mock(async (_url: string, init: { body: string }) => {
      bodies.push(JSON.parse(init.body));
      const next = responses[Math.min(call, responses.length - 1)];
      call++;
      return new Response(JSON.stringify(next.body), { status: next.status });
    }) as typeof global.fetch;
  }

  it('drops thinking.type and retries when the gateway returns a thinking 400', async () => {
    sequence([
      { status: 400, body: { error: { message: "property 'thinking' is unsupported" } } },
      { status: 200, body: { choices: [{ message: { content: 'ok' } }] } },
    ]);

    const response = await (agent as any).fetchWithThinkingFallback(
      GROQ_URL, 'key', 'llama-3.1-8b-instant',
      [{ role: 'user', content: 'hi' }], undefined, 'claude-mem',
      null, new AbortController().signal, 'disabled',
    );

    expect(response.status).toBe(200);
    expect(bodies.length).toBe(2);
    expect(bodies[0].thinking).toEqual({ type: 'disabled' });
    expect(bodies[1].thinking).toBeUndefined();
    expect(thinkingUnsupportedHosts.has('https://api.groq.com')).toBe(true);
  });

  it('skips thinking.type on later calls once the host is marked unsupported', async () => {
    sequence([
      { status: 400, body: { error: { message: "property 'thinking' is unsupported" } } },
      { status: 200, body: { choices: [{ message: { content: 'ok' } }] } },
    ]);

    await (agent as any).fetchWithThinkingFallback(
      GROQ_URL, 'key', 'llama-3.1-8b-instant',
      [{ role: 'user', content: 'hi' }], undefined, 'claude-mem',
      null, new AbortController().signal, 'disabled',
    );

    // Second invocation against the same host: thinking must be omitted up
    // front (single fetch, no 400 round-trip).
    bodies = [];
    sequence([{ status: 200, body: { choices: [{ message: { content: 'ok' } }] } }]);

    await (agent as any).fetchWithThinkingFallback(
      GROQ_URL, 'key', 'llama-3.1-8b-instant',
      [{ role: 'user', content: 'hi' }], undefined, 'claude-mem',
      null, new AbortController().signal, 'disabled',
    );

    expect(bodies.length).toBe(1);
    expect(bodies[0].thinking).toBeUndefined();
  });

  it('does not retry when the 400 is unrelated to thinking', async () => {
    sequence([{ status: 400, body: { error: { message: 'invalid model id' } } }]);

    const response = await (agent as any).fetchWithThinkingFallback(
      'https://api.example.com/v1/chat/completions', 'key', 'm',
      [{ role: 'user', content: 'hi' }], undefined, 'claude-mem',
      null, new AbortController().signal, 'disabled',
    );

    expect(response.status).toBe(400);
    expect(bodies.length).toBe(1);
    expect(thinkingUnsupportedHosts.has('https://api.example.com')).toBe(false);
  });

  it('does not send thinking at all when thinkingType is undefined', async () => {
    sequence([{ status: 200, body: { choices: [{ message: { content: 'ok' } }] } }]);

    const response = await (agent as any).fetchWithThinkingFallback(
      GROQ_URL, 'key', 'llama-3.1-8b-instant',
      [{ role: 'user', content: 'hi' }], undefined, 'claude-mem',
      null, new AbortController().signal, undefined,
    );

    expect(response.status).toBe(200);
    expect(bodies.length).toBe(1);
    expect(bodies[0].thinking).toBeUndefined();
  });
});
