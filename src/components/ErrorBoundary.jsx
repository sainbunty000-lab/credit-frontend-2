import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center space-y-4">
            <h2 className="text-xl font-bold text-red-400">
              Something went wrong
            </h2>
            <p className="text-slate-400 text-sm">
              An unexpected error occurred. Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-xl text-white font-semibold"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
