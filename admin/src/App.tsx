import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import AdminLayout from './components/layout/AdminLayout';
import { AuthProvider } from './context/AuthContext';
import ArticlesPage from './pages/ArticlesPage';
import CategoriesPage from './pages/CategoriesPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import TransfersPage from './pages/TransfersPage';
import VideosPage from './pages/VideosPage';

import BannersPage from './pages/BannersPage';
import NewsletterPage from './pages/NewsletterPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AdminLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/transfers" element={<TransfersPage />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/banners" element={<BannersPage />} />
              <Route path="/newsletter" element={<NewsletterPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
