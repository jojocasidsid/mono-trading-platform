import { useState } from 'react';

import type { CreateTradeRequest } from '@fusion/shared';

import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import useCreateTrade from '@/hooks/trades/useCreateTrade';

import TradeForm from './TradeForm';

export default function CreateTradeDialog() {
  const [open, setOpen] = useState(false);

  const createTradeMutation = useCreateTrade();

  const handleSubmit = async (input: CreateTradeRequest) => {
    await createTradeMutation.mutateAsync(input);

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Create Trade</Button>} />

      <DialogContent className="w-[calc(100%-2rem)] max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Trade</DialogTitle>

          <DialogDescription>Enter the trade details below.</DialogDescription>
        </DialogHeader>

        <TradeForm
          mode="create"
          submitLabel="Create Trade"
          isPending={createTradeMutation.isPending}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
