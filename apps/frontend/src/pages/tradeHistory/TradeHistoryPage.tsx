import { useState } from 'react';

import { Button } from '@/components/ui/button';

import TradeHistoryGrid from './components/TradeHistoryGrid';
import useTradeHistory from '@/hooks/stocks/useTradeHistory';

const PER_PAGE = 20;

export default function TradeHistoryPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } = useTradeHistory({
    page,
    perPage: PER_PAGE,
  });

  if (isError) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border">
        <div className="space-y-1 text-center">
          <p className="font-medium">Failed to load trade history</p>

          <p className="text-sm text-muted-foreground">
            Something went wrong while loading your trade history.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            void refetch();
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const history = data?.data ?? [];

  const total = data?.pagination.total ?? 0;

  const totalPages = data?.pagination.total_pages ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Trade History</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View your trade activity and audit history.
        </p>
      </div>

      <TradeHistoryGrid
        data={history}
        isLoading={isLoading || isFetching}
        page={page}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
