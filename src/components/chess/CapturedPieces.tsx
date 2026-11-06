import React from 'react';
import { pieceComponents } from './ChessPieces';

interface CapturedPiecesProps {
  captured: { w: string[]; b: string[] };
}

const pieceValue: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };

const CapturedPieces: React.FC<CapturedPiecesProps> = ({ captured }) => {
  const renderCaptured = (pieces: string[], color: 'w' | 'b') => {
    const sorted = [...pieces].sort((a, b) => (pieceValue[b] || 0) - (pieceValue[a] || 0));
    const total = sorted.reduce((sum, p) => sum + (pieceValue[p] || 0), 0);
    const otherColor = color === 'w' ? 'b' : 'w';
    const otherTotal = captured[otherColor].reduce((sum, p) => sum + (pieceValue[p] || 0), 0);
    const advantage = total - otherTotal;

    return (
      <div className="flex items-center gap-1 flex-wrap">
        {sorted.map((p, i) => {
          const key = `${color === 'w' ? 'b' : 'w'}${p.toUpperCase()}`;
          const Comp = pieceComponents[key];
          return Comp ? (
            <div key={`${key}-${i}`} className="w-5 h-5 opacity-60">
              <Comp size={20} />
            </div>
          ) : null;
        })}
        {advantage > 0 && (
          <span className="text-xs text-muted-foreground ml-1">+{advantage}</span>
        )}
      </div>
    );
  };

  return (
    <div className="glass-panel p-3 space-y-2">
      <div>
        <span className="text-[10px] font-display text-muted-foreground uppercase tracking-wider">Captured by White</span>
        {renderCaptured(captured.b, 'b')}
      </div>
      <div>
        <span className="text-[10px] font-display text-muted-foreground uppercase tracking-wider">Captured by Black</span>
        {renderCaptured(captured.w, 'w')}
      </div>
    </div>
  );
};

export default CapturedPieces;
