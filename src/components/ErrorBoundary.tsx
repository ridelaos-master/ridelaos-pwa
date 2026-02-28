import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-rl-bg p-4 text-rl-green">
          <p className="text-center font-medium">오류가 발생했습니다</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-btn bg-rl-green px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            새로고침
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
