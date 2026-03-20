import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 🔥 Error Boundary (prevents blank screen crashes)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>⚠️ Something went wrong. Please refresh.</h2>;
    }

    return this.props.children;
  }
}

// 🔥 Root render (React 18)
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
