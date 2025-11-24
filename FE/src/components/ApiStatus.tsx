import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api.config';
import axios from 'axios';

export const ApiStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      setStatus('checking');
      setErrorMessage('');
      
      const response = await axios.get(`${API_BASE_URL}/health`, {
        timeout: 5000,
        headers: {
          // Header này để bypass Ngrok warning page
          'ngrok-skip-browser-warning': 'true',
        },
      });
      
      if (response.data?.status === 'ok') {
        setStatus('online');
      } else {
        setStatus('offline');
        setErrorMessage('API không trả về status ok');
      }
    } catch (error) {
      setStatus('offline');
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK') {
          setErrorMessage('Không thể kết nối đến API. Kiểm tra:\n1. API có đang chạy?\n2. URL trong .env đúng chưa?\n3. CORS đã enable chưa?');
        } else if (error.response) {
          setErrorMessage(`API trả về lỗi: ${error.response.status} - ${error.response.statusText}`);
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage('Lỗi không xác định');
      }
    }
  };

  if (status === 'online') return null; // Không hiển thị gì nếu API hoạt động tốt

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className={`rounded-lg shadow-xl p-4 ${
        status === 'checking' ? 'bg-blue-50 border border-blue-200' :
        'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-start gap-3">
          {status === 'checking' ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
          ) : (
            <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          
          <div className="flex-1">
            <h4 className={`font-semibold mb-1 ${
              status === 'checking' ? 'text-blue-900' : 'text-red-900'
            }`}>
              {status === 'checking' ? 'Đang kiểm tra kết nối API...' : 'Không thể kết nối API'}
            </h4>
            
            {status === 'offline' && (
              <>
                <p className="text-sm text-red-800 mb-2 whitespace-pre-line">{errorMessage}</p>
                <p className="text-xs text-red-700 mb-3">
                  API URL: <code className="bg-red-100 px-1 rounded">{API_BASE_URL}</code>
                </p>
                <button
                  onClick={checkApiHealth}
                  className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  🔄 Thử lại
                </button>
              </>
            )}
          </div>
          
          {status === 'offline' && (
            <button
              onClick={() => setStatus('online')}
              className="text-red-400 hover:text-red-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

