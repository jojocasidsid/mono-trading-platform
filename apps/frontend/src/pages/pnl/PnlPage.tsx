import useAggregatedPnl from '@/hooks/trades/useAggregatedPnl';

import PnlGrid from './components/PnlGrid';

export default function PnlPage() {
  const { data = [], isLoading, isFetching, isError, refetch } = useAggregatedPnl();

  if (isError) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border">
        <p className="font-medium">Failed to load P&L</p>

        <button
          type="button"
          className="text-sm underline"
          onClick={() => {
            void refetch();
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">P&L by Symbol</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View aggregate unrealized P&L by symbol.
        </p>
      </div>

      <PnlGrid data={data} isLoading={isLoading} isFetching={isFetching} />
    </div>
  );
}
