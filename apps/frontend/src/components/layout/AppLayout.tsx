import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <div className="lg:pl-64">
        <AppHeader />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
