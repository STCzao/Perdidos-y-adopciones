import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 text-center">
          <h1 className="text-4xl font-bold text-[#FF7857] mb-4">
            Algo salió mal
          </h1>
          <p className="text-white/70 mb-6 max-w-md">
            Ocurrió un error inesperado. Podés volver al inicio e intentarlo de
            nuevo.
          </p>
          <button
            onClick={this.handleReset}
            className="px-6 py-2 rounded-full bg-[#FF7857] hover:bg-[#e5674f] text-white font-medium transition-colors cursor-pointer"
          >
            Volver al inicio
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
