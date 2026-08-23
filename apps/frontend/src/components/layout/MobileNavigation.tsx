import { ChartNoAxesCombined, History, LineChart, Menu } from 'lucide-react';

import { NavLink } from 'react-router-dom';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';

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

export default function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
        <Menu className="size-5" />

        <span className="sr-only">Open navigation</span>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle>Fusion</SheetTitle>
        </SheetHeader>

        <nav className="space-y-1 p-4">
          {navigation.map(item => {
            const Icon = item.icon;

            return (
              <SheetClose
                key={item.href}
                render={
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )
                    }
                  />
                }
              >
                <Icon className="size-4" />

                {item.name}
              </SheetClose>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
