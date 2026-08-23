import { useState } from 'react';

import { Ban, MoreHorizontal, Pencil, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import useCancelTrade from '@/hooks/trades/useCancelTrade';
import useCloseTrade from '@/hooks/trades/useCloseTrade';

import type { Trade } from '@/types/trade';

import UpdateTradeDialog from './UpdateTradeDialog';

interface TradeActionsProps {
  trade: Trade;
}

export default function TradeActions({ trade }: TradeActionsProps) {
  const [updateOpen, setUpdateOpen] = useState(false);

  const [cancelOpen, setCancelOpen] = useState(false);

  const [closeOpen, setCloseOpen] = useState(false);

  const cancelTradeMutation = useCancelTrade();

  const closeTradeMutation = useCloseTrade();

  const isActive = trade.status === 'ACTIVE';

  const handleCancel = async () => {
    try {
      await cancelTradeMutation.mutateAsync(trade.id);

      setCancelOpen(false);
    } catch {
      // Mutation error is available through:
      // cancelTradeMutation.error
      //
      // Keep the dialog open when the request fails.
    }
  };

  const handleClose = async () => {
    try {
      await closeTradeMutation.mutateAsync(trade.id);

      setCloseOpen(false);
    } catch {
      // Keep the dialog open when the request fails.
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button type="button" variant="ghost" size="icon" aria-label="Trade actions">
              <MoreHorizontal className="size-4" />
            </Button>
          }
        />

        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={!isActive} onClick={() => setUpdateOpen(true)}>
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem disabled={!isActive} onClick={() => setCancelOpen(true)}>
            <Ban className="size-4" />
            Cancel
          </DropdownMenuItem>

          <DropdownMenuItem disabled={!isActive} onClick={() => setCloseOpen(true)}>
            <XCircle className="size-4" />
            Close
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Update Trade */}
      <UpdateTradeDialog trade={trade} open={updateOpen} onOpenChange={setUpdateOpen} />

      {/* Cancel Trade */}
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel trade?</AlertDialogTitle>

            <AlertDialogDescription>
              This will cancel the {trade.symbol} trade. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {cancelTradeMutation.isError && (
            <p className="text-sm text-destructive">
              Failed to cancel the trade. Please try again.
            </p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              size="default"
              variant="outline"
              disabled={cancelTradeMutation.isPending}
            >
              Back
            </AlertDialogCancel>

            <Button
              type="button"
              variant="destructive"
              disabled={cancelTradeMutation.isPending}
              onClick={() => {
                void handleCancel();
              }}
            >
              {cancelTradeMutation.isPending ? 'Cancelling...' : 'Cancel Trade'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Close Trade */}
      <AlertDialog open={closeOpen} onOpenChange={setCloseOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close trade?</AlertDialogTitle>

            <AlertDialogDescription>
              This will close the {trade.symbol} trade. The trade will no longer be active.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {closeTradeMutation.isError && (
            <p className="text-sm text-destructive">Failed to close the trade. Please try again.</p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              size="default"
              variant="outline"
              disabled={closeTradeMutation.isPending}
            >
              Back
            </AlertDialogCancel>

            <Button
              type="button"
              variant="default"
              disabled={closeTradeMutation.isPending}
              onClick={() => {
                void handleClose();
              }}
            >
              {closeTradeMutation.isPending ? 'Closing...' : 'Close Trade'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
