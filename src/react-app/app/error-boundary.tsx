import type { ReactNode } from "react";
import { Component } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  private readonly handleRetry = () => {
    // Error boundaries require class state to remount children after a failure.
    // oxlint-disable-next-line react/no-set-state
    this.setState({ hasError: false });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main aria-labelledby="render-error-title" role="alert">
          <h1 id="render-error-title">Something went wrong</h1>
          <p>
            We couldn’t display this page. Try again to reload its contents.
          </p>
          <button onClick={this.handleRetry} type="button">
            Try again
          </button>
          <p>If the problem continues, refresh your browser and try again.</p>
        </main>
      );
    }

    return this.props.children;
  }
}
