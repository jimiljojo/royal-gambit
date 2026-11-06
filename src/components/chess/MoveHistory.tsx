import React from 'react';
import { Move } from 'chess.js';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface MoveHistoryProps {
  moves: Move[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  const pairs: { num: number; white: string; black?: string }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({
      num: Math.floor(i / 2) + 1,
      white: moves[i].san,
      black: moves[i + 1]?.san,
    });
  }

  return (
    <div className="glass-panel p-4">
      <h3 className="font-display text-sm text-primary mb-3 tracking-wider uppercase">Move History</h3>
      <ScrollArea className="h-48">
        {pairs.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">No moves yet</p>
        ) : (
          <div className="space-y-1">
            {pairs.map((pair) => (
              <div key={pair.num} className="flex items-center gap-2 text-sm font-body">
                <span className="text-muted-foreground w-6 text-right">{pair.num}.</span>
                <span className={cn(
                  "w-16 px-1.5 py-0.5 rounded text-center",
                  pair.num === pairs.length && !pair.black && "bg-primary/20 text-primary"
                )}>
                  {pair.white}
                </span>
                {pair.black && (
                  <span className={cn(
                    "w-16 px-1.5 py-0.5 rounded text-center",
                    pair.num === pairs.length && "bg-primary/20 text-primary"
                  )}>
                    {pair.black}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default MoveHistory;
