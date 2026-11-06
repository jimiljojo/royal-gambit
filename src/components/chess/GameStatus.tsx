import React from 'react';
import { GameState } from '@/hooks/useChessGame';
import { cn } from '@/lib/utils';
import { Crown, Flag, Handshake, Shield } from 'lucide-react';

interface GameStatusProps {
  gameState: GameState;
}

const GameStatus: React.FC<GameStatusProps> = ({ gameState }) => {
  const { turn, isCheck, isCheckmate, isStalemate, isDraw, isGameOver } = gameState;

  let statusText = '';
  let StatusIcon = Crown;
  let statusColor = 'text-primary';

  if (isCheckmate) {
    statusText = `Checkmate! ${turn === 'w' ? 'Black' : 'White'} wins!`;
    StatusIcon = Crown;
    statusColor = 'text-primary';
  } else if (isStalemate) {
    statusText = 'Stalemate — Draw';
    StatusIcon = Handshake;
    statusColor = 'text-muted-foreground';
  } else if (isDraw) {
    statusText = 'Draw';
    StatusIcon = Handshake;
    statusColor = 'text-muted-foreground';
  } else if (isCheck) {
    statusText = `${turn === 'w' ? 'White' : 'Black'} is in Check!`;
    StatusIcon = Shield;
    statusColor = 'text-destructive';
  } else {
    statusText = `${turn === 'w' ? 'White' : 'Black'} to move`;
    StatusIcon = Flag;
    statusColor = 'text-foreground';
  }

  return (
    <div className={cn(
      "glass-panel p-4 flex items-center gap-3",
      isGameOver && "gold-glow"
    )}>
      <StatusIcon className={cn("w-5 h-5", statusColor)} />
      <span className={cn("font-display text-sm tracking-wide", statusColor)}>
        {statusText}
      </span>
      {!isGameOver && (
        <div className={cn(
          "ml-auto w-4 h-4 rounded-full border-2",
          turn === 'w'
            ? "bg-foreground/90 border-foreground"
            : "bg-background border-muted-foreground"
        )} />
      )}
    </div>
  );
};

export default GameStatus;
