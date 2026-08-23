import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import useStocks from '@/hooks/stocks/useStocks';

import type { TradeListParams, TradeSide, TradeStatus } from '@/types/trade';

interface TradeFiltersProps {
  filters: TradeListParams;

  onSymbolChange: (symbol?: string) => void;

  onSideChange: (side?: TradeSide) => void;

  onStatusChange: (status?: TradeStatus) => void;

  onBookChange: (book?: string) => void;

  onCounterpartyChange: (counterparty?: string) => void;

  onReset: () => void;
}

export default function TradeFilters({
  filters,
  onSymbolChange,
  onSideChange,
  onStatusChange,
  onBookChange,
  onCounterpartyChange,
  onReset,
}: TradeFiltersProps) {
  const { data: stocks = [] } = useStocks();

  return (
    <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-6">
      <Select
        value={filters.symbol ?? ''}
        onValueChange={value => {
          onSymbolChange(value || undefined);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Symbol" />
        </SelectTrigger>

        <SelectContent>
          {stocks.map(stock => (
            <SelectItem key={stock.symbol} value={stock.symbol}>
              {stock.symbol}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.side ?? ''}
        onValueChange={value => {
          onSideChange(value ? (value as TradeSide) : undefined);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Side" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="BUY">Buy</SelectItem>

          <SelectItem value="SELL">Sell</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.status ?? ''}
        onValueChange={value => {
          onStatusChange(value ? (value as TradeStatus) : undefined);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ACTIVE">Active</SelectItem>

          <SelectItem value="CANCELLED">Cancelled</SelectItem>

          <SelectItem value="CLOSED">Closed</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Book"
        value={filters.book ?? ''}
        onChange={event => onBookChange(event.target.value || undefined)}
      />

      <Input
        placeholder="Counterparty"
        value={filters.counterparty ?? ''}
        onChange={event => onCounterpartyChange(event.target.value || undefined)}
      />

      <Button type="button" variant="outline" onClick={onReset}>
        Reset
      </Button>
    </div>
  );
}
