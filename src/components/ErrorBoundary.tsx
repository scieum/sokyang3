import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * 앱 전역 에러 바운더리.
 * 렌더 중 예외가 나도 흰 화면 대신 오류 내용을 표시한다.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[TOT] 렌더 오류:', error, info);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="fatal-error">
          <h1>TOT</h1>
          <p>화면을 표시하는 중 오류가 발생했습니다.</p>
          <pre>{this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
