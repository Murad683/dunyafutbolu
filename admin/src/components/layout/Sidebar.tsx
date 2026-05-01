import { ArrowLeftRight, FileText, LayoutDashboard, LogOut, Tag, Trophy, Video, Image, Mail } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/articles', icon: FileText, label: 'Articles' },
  { to: '/categories', icon: Tag, label: 'Categories' },
  { to: '/transfers', icon: ArrowLeftRight, label: 'Transfers' },
  { to: '/videos', icon: Video, label: 'Videos' },
  { to: '/banners', icon: Image, label: 'Banners & Ads' },
  { to: '/newsletter', icon: Mail, label: 'Newsletter' },
];

export default function Sidebar() {
  const { email, logout } = useAuth();

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-brand p-2 text-white">
            <Trophy size={18} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">Dünya Futbolu</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive ? 'bg-brand/10 text-brand-dark' : 'text-gray-600 hover:bg-gray-100',
              )
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <p className="mb-2 truncate text-xs text-gray-500">{email}</p>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 text-sm font-medium text-red-600 transition-colors hover:text-red-700"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
