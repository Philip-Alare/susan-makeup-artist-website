import { Bell, Menu, User, LogOut } from "lucide-react";

interface NavbarProps {
  onMenuToggle?: () => void;
  onLogout?: () => void;
}

export function Navbar({ onMenuToggle, onLogout }: NavbarProps) {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-[#d6c4a5]/30 shadow-sm z-30 flex items-center justify-between px-6">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="hidden md:block">
        <h1 className="text-[#2c1a0a] font-display text-lg">Susan Makeup Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#C9A24D] rounded-full"></span>
        </button>

        <button
          onClick={onLogout}
          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-muted-foreground"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-[#2c1a0a]">Susan Eworo</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#C9A24D] flex items-center justify-center text-[#1c1208]">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
