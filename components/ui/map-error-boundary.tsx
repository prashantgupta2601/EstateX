'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorState from '@/components/ui/error-state';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class MapErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Leaflet Map failed to initialize:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          title="Map Loading Failed"
          description="The interactive map could not be initialized. This can happen due to web layout issues or missing map dependencies."
          actionLabel="Retry Loading"
          onAction={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}
