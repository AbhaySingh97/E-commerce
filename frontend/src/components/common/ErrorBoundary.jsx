import { Component } from 'react';

/**
 * ErrorBoundary — catches any runtime errors in the component tree
 * and renders a premium fallback UI instead of a white screen.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[Caryqel ErrorBoundary]', error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#080808',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', sans-serif",
          color: '#fff',
          padding: '40px 24px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #a855f7, #d946ef)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            marginBottom: '32px',
            boxShadow: '0 0 40px rgba(168,85,247,0.4)',
          }}>
            ✦
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 300, letterSpacing: '0.05em', marginBottom: '12px' }}>
            Something went wrong
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', maxWidth: '360px', marginBottom: '40px', lineHeight: 1.6 }}>
            An unexpected error interrupted the experience. Our team has been notified.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '14px 40px',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Reload Caryqel
          </button>
          {import.meta.env.DEV && (
            <pre style={{
              marginTop: '40px',
              padding: '20px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '12px',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.3)',
              textAlign: 'left',
              maxWidth: '600px',
              overflow: 'auto',
            }}>
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
