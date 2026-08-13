import React, { Component, ReactNode, ErrorInfo } from 'react';
import { I18nProvider, useI18n } from '../i18n/I18nProvider';
import { normalizeLocale } from '../i18n/core';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

function ErrorFallback({ error, errorInfo }: { error: Error | null; errorInfo: ErrorInfo | null }) {
  const { t } = useI18n();
  return (
    <div style={{ padding: '20px', color: '#ff6b6b', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>{t('error.title')}</h1>
      <p style={{ marginBottom: '10px', color: '#8b949e' }}>
        {t('error.description')}
      </p>
      {error && (
        <details style={{ marginTop: '20px', color: '#8b949e' }}>
          <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>{t('error.details')}</summary>
          <pre style={{
            backgroundColor: '#0d1117',
            padding: '10px',
            borderRadius: '6px',
            overflow: 'auto'
          }}>
            {error.toString()}
            {errorInfo && '\n\n' + errorInfo.componentStack}
          </pre>
        </details>
      )}
    </div>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // The fallback renders outside I18nProvider (ErrorBoundary wraps <App/> at
      // the root), so seed a provider from <html lang>, which useLocale keeps in
      // sync with the active locale.
      const locale = normalizeLocale(
        typeof document !== 'undefined' ? document.documentElement.lang : null
      ) ?? 'en';
      return (
        <I18nProvider locale={locale}>
          <ErrorFallback error={this.state.error} errorInfo={this.state.errorInfo} />
        </I18nProvider>
      );
    }

    return this.props.children;
  }
}
