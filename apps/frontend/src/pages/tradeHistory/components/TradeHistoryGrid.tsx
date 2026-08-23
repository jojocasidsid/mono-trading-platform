import { useMemo } from 'react';

import { AgGridReact } from 'ag-grid-react';

import type { ColDef } from 'ag-grid-community';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import { Button } from '@/components/ui/button';

import { formatDate } from '@/lib/formatDate';

import type { TradeHistory } from '@/types/tradeHistory';

ModuleRegistry.registerModules([AllCommunityModule]);

interface TradeHistoryGridProps {
  data: TradeHistory[];
  isLoading: boolean;

  page: number;
  totalPages: number;
  total: number;

  onPageChange: (page: number) => void;
}

export default function TradeHistoryGrid({
  data,
  isLoading,
  page,
  totalPages,
  total,
  onPageChange,
}: TradeHistoryGridProps) {
  const columnDefs = useMemo<ColDef<TradeHistory>[]>(
    () => [
      {
        field: 'action',
        headerName: 'Action',
      },
      {
        field: 'trade_id',
        headerName: 'Trade ID',
      },
      {
        field: 'trade.symbol',
        headerName: 'Symbol',
      },
      {
        field: 'trade.quantity',
        headerName: 'Quantity',
      },
      {
        field: 'trade.price',
        headerName: 'Price',
      },
      {
        field: 'created_at',
        valueFormatter: params => (params.value ? formatDate(params.value) : '-'),
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 110,
      resizable: true,
      sortable: true,
    }),
    []
  );

  return (
    <div className="space-y-4">
      <div className="w-full overflow-hidden rounded-lg border">
        <AgGridReact<TradeHistory>
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          loading={isLoading}
          domLayout="autoHeight"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {total} trade history
          {total === 1 ? ' record' : ' records'}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isLoading}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>

          <span className="min-w-24 text-center text-sm">
            Page {page} of {Math.max(totalPages, 1)}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || isLoading}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
