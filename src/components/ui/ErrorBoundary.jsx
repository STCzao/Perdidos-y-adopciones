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
    const requestId =
      error?.requestId ||
      error?.response?.data?.requestId ||
      error?.response?.headers?.["x-request-id"] ||
      "";

    console.error("ErrorBoundary caught:", {
      error,
      componentStack: info.componentStack,
      requestId,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold text-[#FF7857]">Algo salió mal</h1>
          <p className="mb-6 max-w-md text-white/70">
            Ocurrió un error inesperado. Podés volver al inicio e intentarlo de nuevo.
          </p>
          <button
            onClick={this.handleReset}
            className="cursor-pointer rounded-full bg-[#FF7857] px-6 py-2 font-medium text-white transition-colors hover:bg-[#e5674f]"
          >
            Volver al inicio
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
