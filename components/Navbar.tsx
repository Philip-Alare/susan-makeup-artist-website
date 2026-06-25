import { ArrowLeft, Bell, Menu, User, LogOut } from "lucide-react";

interface NavbarProps {
  title?: string;
  canGoBack?: boolean;
  onBack?: () => void;
  onMenuToggle?: () => void;
  onLogout?: () => void;
}

export function Navbar({ title = "Dashboard", canGoBack = false, onBack, onMenuToggle, onLogout }: NavbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-[#E5E5E5] bg-white px-4 shadow-sm sm:px-6 lg:left-64">
      <div className="flex min-w-0 items-center gap-1 sm:gap-3">
        {canGoBack && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg p-2 transition-colors hover:bg-[#F5F5F5] lg:hidden"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-lg p-2 transition-colors hover:bg-[#F5F5F5] lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <p className="truncate font-display text-sm text-black sm:hidden">{title}</p>
          <h1 className="hidden truncate font-display text-lg text-black md:block">
            Susan Makeup Dashboard
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative hidden rounded-lg p-2 transition-colors hover:bg-[#F5F5F5] sm:inline-flex">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-black"></span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-[#F5F5F5]"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 border-l border-border pl-3 sm:pl-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-black">Susan Eworo</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-[#FFFFFF]">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
