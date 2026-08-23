import { ChartNoAxesCombined, History, LineChart } from 'lucide-react';

import { NavLink } from 'react-router-dom';

import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Trades',
    href: '/trades',
    icon: LineChart,
  },
  {
    name: 'P&L',
    href: '/pnl',
    icon: ChartNoAxesCombined,
  },
  {
    name: 'Trade History',
    href: '/trade-history',
    icon: History,
  },
];

export default function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-background lg:block">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-semibold">Fusion</span>
      </div>

      <nav className="space-y-1 p-4">
        {navigation.map(item => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <Icon className="size-4" />

              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
