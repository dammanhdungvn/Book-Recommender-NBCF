import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts';
import { Layout } from './components/layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ApiStatus } from './components/ApiStatus';
import {
  HomePage,
  CatalogPage,
  SearchPage,
  BookDetailPage,
  RecommendationsPage,
} from './pages';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <UserProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/books" element={<CatalogPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/books/:isbn" element={<BookDetailPage />} />
              <Route path="/users/:userId/recommendations" element={<RecommendationsPage />} />
            </Routes>
          </Layout>
          <ApiStatus />
        </UserProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
