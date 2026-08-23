import {
  create_trade_schema,
  update_trade_schema,
  type CreateTradeRequest,
  type UpdateTradeFormInput,
  type UpdateTradeRequest,
} from '@fusion/shared';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import useStocks from '@/hooks/stocks/useStocks';

interface BaseTradeFormValues {
  symbol?: string;
  side?: 'BUY' | 'SELL';
  quantity?: number;
  price?: number;
  book?: string;
  counterparty?: string;
}

interface TradeFormProps {
  mode: 'create' | 'update';

  defaultValues?: BaseTradeFormValues;

  isPending?: boolean;

  submitLabel: string;

  onSubmit:
    | ((input: CreateTradeRequest) => Promise<void>)
    | ((input: UpdateTradeRequest) => Promise<void>);
}

export default function TradeForm({
  mode,
  defaultValues,
  isPending = false,
  submitLabel,
  onSubmit,
}: TradeFormProps) {
  const { data: stocks = [], isLoading: isStocksLoading } = useStocks();

  const schema = mode === 'create' ? create_trade_schema : update_trade_schema;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<
    CreateTradeRequest | UpdateTradeFormInput,
    unknown,
    CreateTradeRequest | UpdateTradeRequest
  >({
    resolver: zodResolver(schema),

    defaultValues: {
      symbol: defaultValues?.symbol ?? '',

      side: defaultValues?.side ?? 'BUY',

      quantity: defaultValues?.quantity ?? 1,

      price: defaultValues?.price ?? 0,

      book: defaultValues?.book ?? '',

      counterparty: defaultValues?.counterparty ?? '',
    },
  });

  const submit = async (input: CreateTradeRequest | UpdateTradeRequest) => {
    await onSubmit(input as never);
  };

  const pending = isPending || isSubmitting;

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <Controller
        name="symbol"
        control={control}
        render={({ field }) => (
          <div className="grid gap-2">
            <Label>Symbol</Label>

            <Select
              value={field.value}
              disabled={isStocksLoading}
              onValueChange={value => {
                if (value !== null) {
                  field.onChange(value);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select stock" />
              </SelectTrigger>

              <SelectContent>
                {stocks.map(stock => (
                  <SelectItem key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.symbol && <p className="text-sm text-destructive">{errors.symbol.message}</p>}
          </div>
        )}
      />

      <Controller
        name="side"
        control={control}
        render={({ field }) => (
          <div className="grid gap-2">
            <Label>Side</Label>

            <Select
              value={field.value}
              onValueChange={value => {
                if (value !== null) {
                  field.onChange(value);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select side" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="BUY">Buy</SelectItem>

                <SelectItem value="SELL">Sell</SelectItem>
              </SelectContent>
            </Select>

            {errors.side && <p className="text-sm text-destructive">{errors.side.message}</p>}
          </div>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantity</Label>

          <Input
            id="quantity"
            type="number"
            min={1}
            {...register('quantity', {
              valueAsNumber: true,
            })}
          />

          {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>

          <Input
            id="price"
            type="number"
            min={0.01}
            step="0.01"
            {...register('price', {
              valueAsNumber: true,
            })}
          />

          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="book">Book</Label>

        <Input id="book" {...register('book')} />

        {errors.book && <p className="text-sm text-destructive">{errors.book.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="counterparty">Counterparty</Label>

        <Input id="counterparty" {...register('counterparty')} />

        {errors.counterparty && (
          <p className="text-sm text-destructive">{errors.counterparty.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
        {pending ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
