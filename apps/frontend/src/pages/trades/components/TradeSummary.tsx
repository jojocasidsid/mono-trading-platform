import { useEffect, useRef, type ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { formatCurrency } from '@/lib/formatCurrency';

import type { TradeSummary as TradeSummaryType } from '@/types/trade';

interface TradeSummaryProps {
  data?: TradeSummaryType;
  isLoading: boolean;
}

interface SummaryCardProps {
  label: string;
  value: ReactNode;
  numericValue?: number;
  flash?: boolean;
}

function SummaryCard({ label, value, numericValue, flash = false }: SummaryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const previousValueRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!flash || numericValue === undefined) {
      return;
    }

    const previousValue = previousValueRef.current;

    previousValueRef.current = numericValue;

    if (previousValue === undefined || previousValue === numericValue) {
      return;
    }

    const element = cardRef.current;

    if (!element) {
      return;
    }

    const className = numericValue > previousValue ? 'animate-price-up' : 'animate-price-down';

    element.classList.remove('animate-price-up', 'animate-price-down');

    // Restart the animation even if
    // consecutive updates move in
    // the same direction.
    void element.offsetWidth;

    element.classList.add(className);

    const timeout = window.setTimeout(() => {
      element.classList.remove(className);
    }, 700);

    return () => {
      window.clearTimeout(timeout);

      element.classList.remove(className);
    };
  }, [numericValue, flash]);

  return (
    <div>
      <Card className="h-full" ref={cardRef}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-2xl font-semibold">{value}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TradeSummary({ data, isLoading }: TradeSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <SummaryCard
        label="Total P/L"
        numericValue={data?.total_unrealized_pnl}
        value={isLoading ? '...' : data ? formatCurrency(data.total_unrealized_pnl) : '-'}
        flash
      />

      <SummaryCard
        label="Market Value"
        numericValue={data?.total_market_value}
        value={isLoading ? '...' : data ? formatCurrency(data.total_market_value) : '-'}
        flash
      />

      <SummaryCard label="Active Trades" value={isLoading ? '...' : (data?.active_trades ?? 0)} />

      <SummaryCard label="Closed Trades" value={isLoading ? '...' : (data?.closed_trades ?? 0)} />

      <SummaryCard
        label="Cancelled Trades"
        value={isLoading ? '...' : (data?.cancelled_trades ?? 0)}
      />
    </div>
  );
}
