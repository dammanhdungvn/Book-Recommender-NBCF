import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Đã xảy ra lỗi</h1>
                <p className="text-gray-600">Ứng dụng gặp sự cố không mong muốn</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-900 mb-2">Chi tiết lỗi:</h3>
              <p className="text-sm text-red-800 font-mono">{this.state.error?.message}</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Các bước khắc phục:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
                <li>Kiểm tra file <code className="bg-yellow-100 px-1 rounded">.env</code> đã được tạo chưa</li>
                <li>Đảm bảo API backend đang chạy</li>
                <li>Kiểm tra URL trong file <code className="bg-yellow-100 px-1 rounded">.env</code></li>
                <li>Kiểm tra CORS đã được enable trên backend</li>
                <li>Mở Console (F12) để xem thêm chi tiết lỗi</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                🔄 Tải lại trang
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                🏠 Về trang chủ
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <details className="text-sm">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium">
                  Stack trace (cho developers)
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-48">
                  {this.state.error?.stack}
                </pre>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

