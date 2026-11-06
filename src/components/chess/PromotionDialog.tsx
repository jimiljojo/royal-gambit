import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WhiteQueen, WhiteRook, WhiteBishop, WhiteKnight, BlackQueen, BlackRook, BlackBishop, BlackKnight } from './ChessPieces';

interface PromotionDialogProps {
  open: boolean;
  color: 'w' | 'b';
  onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
}

const PromotionDialog: React.FC<PromotionDialogProps> = ({ open, color, onSelect }) => {
  const pieces: { key: 'q' | 'r' | 'b' | 'n'; label: string; White: React.FC<any>; Black: React.FC<any> }[] = [
    { key: 'q', label: 'Queen', White: WhiteQueen, Black: BlackQueen },
    { key: 'r', label: 'Rook', White: WhiteRook, Black: BlackRook },
    { key: 'b', label: 'Bishop', White: WhiteBishop, Black: BlackBishop },
    { key: 'n', label: 'Knight', White: WhiteKnight, Black: BlackKnight },
  ];

  return (
    <Dialog open={open}>
      <DialogContent className="glass-panel max-w-xs">
        <DialogHeader>
          <DialogTitle className="font-display text-primary text-center">Promote Pawn</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center gap-3 py-4">
          {pieces.map(({ key, label, White, Black }) => {
            const Comp = color === 'w' ? White : Black;
            return (
              <button
                key={key}
                onClick={() => onSelect(key)}
                className="w-16 h-16 flex items-center justify-center rounded-lg border border-glass-border hover:border-primary hover:bg-primary/10 transition-all"
                aria-label={`Promote to ${label}`}
              >
                <Comp size={40} />
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionDialog;
