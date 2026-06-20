import { LayoutDashboard, FileText, Image, Settings, LogOut, Calendar, X } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ currentPage, onNavigate, onLogout, isOpen = false, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'content', label: 'Content Manager', icon: FileText },
    { id: 'images', label: 'Gallery Manager', icon: Image },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close navigation menu"
        className={`fixed inset-0 z-40 bg-black/45 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[85vw] max-w-72 flex-col bg-black text-[#FFFFFF] shadow-xl transition-transform duration-300 lg:w-64 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="border-b border-[#2A2A2A] p-5 lg:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white bg-black shadow-md">
                <span className="text-xl font-bold text-[#FFFFFF]">SM</span>
              </div>
              <div>
                <h2 className="font-display text-[#FFFFFF]">Susan Makeup</h2>
                <p className="text-xs text-[#999999]">Admin Dashboard</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-[#E5E5E5] transition-colors hover:bg-[#111111] lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-5 lg:px-4 lg:py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onClose?.();
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? 'scale-[1.02] bg-[#1A1A1A] font-medium text-[#FFFFFF]'
                    : 'text-[#E5E5E5] hover:scale-[1.02] hover:bg-[#111111]'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[#2A2A2A] p-3 lg:p-4">
          <button
            type="button"
            onClick={() => {
              onClose?.();
              onLogout?.();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[#E5E5E5] transition-all duration-200 hover:bg-[#111111] hover:text-[#FFFFFF]"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
