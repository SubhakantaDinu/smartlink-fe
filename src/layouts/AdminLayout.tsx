import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, QrCode, PlusSquare, LogOut, Menu, X, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/qr', label: 'QR Codes', icon: QrCode, end: false },
  { to: '/admin/generate', label: 'Generate', icon: PlusSquare, end: false },
];

export function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
    }`;

  const Sidebar = () => (
    <nav className="flex flex-col h-full p-4">
      <div className="flex items-center gap-2 px-1 mb-8">
        <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
          <Zap size={14} className="text-zinc-950" />
        </div>
        <span className="text-zinc-100 font-semibold tracking-tight">SmartLink</span>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={navLinkClass}
            onClick={() => setMobileOpen(false)}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </div>

      <div className="border-t border-zinc-800 pt-4 mt-4">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-transform duration-200 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-zinc-800 bg-zinc-950">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 text-zinc-400 hover:text-zinc-100"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
              <Zap size={12} className="text-zinc-950" />
            </div>
            <span className="text-zinc-100 font-semibold text-sm">SmartLink</span>
          </div>
          <div className="w-8" />
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar close button */}
      {mobileOpen && (
        <button
          className="fixed top-4 right-4 z-50 md:hidden p-1.5 rounded-lg bg-zinc-800 text-zinc-300"
          onClick={() => setMobileOpen(false)}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
