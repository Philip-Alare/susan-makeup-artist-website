import { LayoutDashboard, FileText, Image, Settings, LogOut, Calendar } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'content', label: 'Content Manager', icon: FileText },
    { id: 'images', label: 'Gallery Manager', icon: Image },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1c1208] text-[#fdf7ef] flex flex-col shadow-xl z-40">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#3e2b1b]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#C9A24D] flex items-center justify-center shadow-md">
            <span className="text-[#1c1208] font-bold text-xl">SM</span>
          </div>
          <div>
            <h2 className="text-white font-display">Susan Makeup</h2>
            <p className="text-xs text-[#d6c4a5]">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#C9A24D] text-[#1c1208] shadow-lg transform scale-[1.02] font-medium'
                  : 'text-[#d6c4a5] hover:bg-[#3e2b1b] hover:transform hover:scale-[1.02]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#3e2b1b]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#d6c4a5] hover:bg-red-900/20 hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
