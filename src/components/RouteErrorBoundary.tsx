import { Component, type ReactNode } from 'react';
import RouteErrorMessage from './RouteErrorMessage';

export default class RouteErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <RouteErrorMessage /> : this.props.children; }
}
