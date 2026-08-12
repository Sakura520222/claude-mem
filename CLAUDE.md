# Claude-Mem: AI Development Instructions

Claude-mem is a Claude Code plugin providing persistent memory across sessions. It captures tool usage, compresses observations using the Claude Agent SDK, and injects relevant context into future sessions.

## Build

```bash
npm run build-and-sync        # Build, sync to marketplace, restart worker
```

## File Locations

- **Source**: `<project-root>/src/`
- **Built Plugin**: `<project-root>/plugin/`
- **Installed Plugin**: `~/.claude/plugins/marketplaces/thedotmack/`
- **Database**: `~/.claude-mem/claude-mem.db`
- **Chroma**: `~/.claude-mem/chroma/`

## Requirements

- **Bun** (all platforms - auto-installed if missing)
- **uv** (all platforms - auto-installed if missing, provides Python for Chroma)
- Node.js

## Documentation

**Public Docs**: https://docs.claude-mem.ai (Mintlify)
**Source**: `docs/public/` - MDX files, edit `docs.json` for navigation
**Deploy**: Auto-deploys from GitHub on push to main

## Release / Publishing

**Never tag or publish autonomously.** Do not run `git tag`, `git push --tags`, `npm publish`, or trigger the `Publish to npm` workflow unless the user explicitly asks. The user drives every release; the agent prepares the commit and **waits for the go-ahead** before any tag or publish.

When the user does ask for a release, a version bump must be synchronized across **every** place the version is recorded — not just `package.json`. The Version Consistency CI test fails if any disagree:

- `package.json` (`version`)
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json` (`plugins[].version` — **not auto-synced, edit by hand**)
- `.codex-plugin/plugin.json`
- `openclaw/openclaw.plugin.json`
- `plugin/.claude-plugin/plugin.json`
- `plugin/.codex-plugin/plugin.json`
- `plugin/package.json`

`scripts/sync-plugin-manifests.js` syncs the `plugin.json` manifests on build using the **unscoped** plugin name (`claude-mem`, not the scoped npm name `@cherrysakura/claude-mem`) — Codex/Claude reject `@`/`/` in plugin names. `marketplace.json` is the one that is NOT auto-synced and must be hand-edited, or the Version Consistency test breaks.

Release flow (only when the user explicitly asks):
1. Bump version in **all** the files listed above.
2. `npm run typecheck && npm run build && npm run smoke:clean-room`.
3. Commit, push to `main`.
4. **Stop.** Let the user tag and trigger publish — do not run `git tag` / `git push --tags` yourself.

## Important

No need to edit the changelog ever, it's generated automatically.
