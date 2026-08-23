import { LogOut } from 'lucide-react';

import useAuth from '@/hooks/auth/useAuth';

import { Button } from '@/components/ui/button';

import MobileNavigation from './MobileNavigation';

export default function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNavigation />

        <span className="font-semibold lg:hidden">Fusion</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium">{user?.name}</p>

          <p className="text-xs text-muted-foreground">{user?.role}</p>
        </div>

        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="size-4" />

          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </header>
  );
}
