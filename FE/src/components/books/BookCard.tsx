import React from 'react';
import { Link } from 'react-router-dom';
import type { BookItem, Recommendation } from '../../types';

interface BookCardProps {
  book: BookItem | Recommendation;
  showPrediction?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, showPrediction = false }) => {
  const isPrediction = 'predicted_rating' in book;
  const imageUrl = 'img_m' in book 
    ? (book as BookItem).img_m 
    : (book as Recommendation).img_s;

  return (
    <Link
      to={`/books/${book.isbn}`}
      className="card overflow-hidden group cursor-pointer animate-fade-in"
    >
      <div className="relative overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={book.book_title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/200x300?text=No+Image';
          }}
        />
        {isPrediction && showPrediction && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {book.predicted_rating.toFixed(1)}/10
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
          {book.book_title}
        </h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-1">
          {book.book_author}
        </p>
        
        {!isPrediction && 'rating_mean' in book && book.rating_count > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center text-yellow-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span className="ml-1 font-medium">{book.rating_mean.toFixed(1)}</span>
            </div>
            <span className="text-gray-500">({book.rating_count})</span>
          </div>
        )}

        {isPrediction && showPrediction && (
          <div className="flex items-center gap-2 text-sm mt-2">
            <span className="text-gray-600">Dự đoán:</span>
            <span className="font-bold text-primary-600">{book.predicted_rating.toFixed(1)}/10</span>
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-2">
          {book.category && (
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
              {book.category.replace(/[\[\]']/g, '').split(',')[0].trim()}
            </span>
          )}
          {book.language && (
            <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded uppercase">
              {book.language}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

