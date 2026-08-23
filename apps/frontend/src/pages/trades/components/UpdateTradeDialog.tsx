import type { UpdateTradeRequest } from '@fusion/shared';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import useUpdateTrade from '@/hooks/trades/useUpdateTrade';

import type { Trade } from '@/types/trade';

import TradeForm from './TradeForm';

interface UpdateTradeDialogProps {
  trade: Trade | null;

  open: boolean;

  onOpenChange: (open: boolean) => void;
}

export default function UpdateTradeDialog({ trade, open, onOpenChange }: UpdateTradeDialogProps) {
  const updateTradeMutation = useUpdateTrade();

  if (!trade) {
    return null;
  }

  const handleSubmit = async (input: UpdateTradeRequest) => {
    await updateTradeMutation.mutateAsync({
      tradeId: trade.id,
      input,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Trade</DialogTitle>

          <DialogDescription>Update the selected trade details.</DialogDescription>
        </DialogHeader>

        <TradeForm
          mode="update"
          defaultValues={{
            symbol: trade.symbol,
            side: trade.side,
            quantity: trade.quantity,
            price: Number(trade.price),
            book: trade.book,
            counterparty: trade.counterparty,
          }}
          submitLabel="Update Trade"
          isPending={updateTradeMutation.isPending}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
