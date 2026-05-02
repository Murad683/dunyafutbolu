import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
          <div className="flex items-center gap-3">
             <div className="rounded-lg bg-brand p-1.5 text-white">
                <span className="font-bold text-sm">DF</span>
             </div>
             <span className="font-semibold text-gray-900">Admin</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
