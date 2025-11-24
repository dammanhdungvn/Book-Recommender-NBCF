import React from 'react';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ text = 'Đang tải...', fullScreen = false }) => {
  const Container = fullScreen ? 'div' : 'div';
  const containerClass = fullScreen
    ? 'fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50'
    : 'flex items-center justify-center py-12';

  return (
    <Container className={containerClass}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
        {text && <p className="mt-4 text-gray-600 font-medium">{text}</p>}
      </div>
    </Container>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="card p-4 animate-pulse">
      <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
  );
};

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

