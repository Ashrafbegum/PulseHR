import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error("Application render error", error, info); }
  render() {
    if (this.state.hasError) return <main className="error-page"><div><span className="brand-mark">P</span><p className="eyebrow">PULSEHR</p><h1>That didn’t go to plan.</h1><p>Something unexpected happened. Reload the page to try again.</p><button className="submit-button" onClick={() => window.location.reload()}>Reload page</button></div></main>;
    return this.props.children;
  }
}
