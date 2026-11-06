import React, { useRef, useState, useCallback } from 'react';
import { Square } from 'chess.js';
import { getPieceComponent } from './ChessPieces';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ChessBoardProps {
  board: ReturnType<import('chess.js').Chess['board']>;
  flipped: boolean;
  selectedSquare: Square | null;
  validMoves: Square[];
  lastMove: { from: Square; to: Square } | null;
  isCheck: boolean;
  turn: 'w' | 'b';
  onSquareClick: (square: Square) => void;
  gameOver?: boolean;
}

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

function getSquare(row: number, col: number, flipped: boolean): Square {
  const r = flipped ? 7 - row : row;
  const c = flipped ? 7 - col : col;
  return `${files[c]}${ranks[r]}` as Square;
}

function squareToRowCol(square: Square, flipped: boolean): { row: number; col: number } {
  const file = square.charCodeAt(0) - 97; // a=0, h=7
  const rank = 8 - parseInt(square[1]); // 8=0, 1=7
  return {
    row: flipped ? 7 - rank : rank,
    col: flipped ? 7 - file : file,
  };
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  flipped,
  selectedSquare,
  validMoves,
  lastMove,
  isCheck,
  turn,
  onSquareClick,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<{
    square: Square;
    piece: { type: string; color: string };
    x: number;
    y: number;
    startX: number;
    startY: number;
  } | null>(null);

  const getSquareFromPoint = useCallback((clientX: number, clientY: number): Square | null => {
    if (!boardRef.current) return null;
    const rect = boardRef.current.getBoundingClientRect();
    const squareSize = rect.width / 8;
    const col = Math.floor((clientX - rect.left) / squareSize);
    const row = Math.floor((clientY - rect.top) / squareSize);
    if (col < 0 || col > 7 || row < 0 || row > 7) return null;
    return getSquare(row, col, flipped);
  }, [flipped]);

  const handlePointerDown = useCallback((e: React.PointerEvent, square: Square, piece: { type: string; color: string } | null) => {
    if (!piece || piece.color !== turn) return;

    // Select the piece on pointer down (shows valid moves)
    onSquareClick(square);

    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging({
      square,
      piece,
      x: e.clientX,
      y: e.clientY,
      startX: e.clientX,
      startY: e.clientY,
    });
  }, [turn, onSquareClick]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
  }, [dragging]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;

    const dx = Math.abs(e.clientX - dragging.startX);
    const dy = Math.abs(e.clientY - dragging.startY);
    const wasDrag = dx > 5 || dy > 5;

    if (wasDrag) {
      const targetSquare = getSquareFromPoint(e.clientX, e.clientY);
      if (targetSquare && targetSquare !== dragging.square && validMoves.includes(targetSquare)) {
        onSquareClick(targetSquare);
      }
    }
    // If it wasn't a drag, the click handler already fired on pointerDown

    setDragging(null);
  }, [dragging, getSquareFromPoint, validMoves, onSquareClick]);

  const renderSquare = (row: number, col: number) => {
    const square = getSquare(row, col, flipped);
    const r = flipped ? 7 - row : row;
    const c = flipped ? 7 - col : col;
    const piece = board[r]?.[c];
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedSquare === square;
    const isValidMove = validMoves.includes(square);
    const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);
    const isKingInCheck = isCheck && piece?.type === 'k' && piece?.color === turn;
    const isDraggingThis = dragging?.square === square;

    const PieceComponent = piece ? getPieceComponent(piece) : null;

    return (
      <div
        key={square}
        className={cn(
          'relative flex items-center justify-center transition-colors duration-150',
          'aspect-square w-full',
          isLight ? 'bg-board-light' : 'bg-board-dark',
          isSelected && 'ring-2 ring-inset ring-primary z-10',
          isLastMoveSquare && !isSelected && 'bg-board-highlight/40',
          isKingInCheck && 'bg-board-check/60 animate-pulse-gold',
          isValidMove && dragging && 'bg-board-valid/20',
        )}
        onClick={() => {
          if (!dragging) onSquareClick(square);
        }}
        onPointerDown={(e) => handlePointerDown(e, square, piece)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        aria-label={`${square}${piece ? ` - ${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}` : ''}`}
        style={{ touchAction: 'none' }}
      >
        {/* Rank labels */}
        {col === 0 && (
          <span className="absolute top-0.5 left-1 text-[10px] font-display font-bold select-none opacity-60"
            style={{ color: isLight ? 'hsl(25 18% 36%)' : 'hsl(35 25% 72%)' }}>
            {flipped ? ranks[7 - row] : ranks[row]}
          </span>
        )}
        {/* File labels */}
        {row === 7 && (
          <span className="absolute bottom-0.5 right-1 text-[10px] font-display font-bold select-none opacity-60"
            style={{ color: isLight ? 'hsl(25 18% 36%)' : 'hsl(35 25% 72%)' }}>
            {flipped ? files[7 - col] : files[col]}
          </span>
        )}

        {/* Valid move indicator */}
        {isValidMove && !piece && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.15 }}
            className="w-[28%] h-[28%] rounded-full bg-board-valid/50"
          />
        )}
        {isValidMove && piece && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 border-[3px] border-board-valid/60 rounded-sm"
          />
        )}

        {/* Piece (hidden if being dragged) */}
        {PieceComponent && (
          <motion.div
            key={`${square}-${piece?.type}-${piece?.color}`}
            initial={false}
            animate={{
              scale: isDraggingThis ? 0.3 : 1,
              opacity: isDraggingThis ? 0.3 : 1,
            }}
            transition={{ duration: 0.12 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          >
            <div className="w-[85%] h-[85%]">
              <PieceComponent size={45} />
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  // Calculate drag ghost position
  const dragGhost = dragging ? (() => {
    const DragPiece = getPieceComponent(dragging.piece);
    if (!DragPiece || !boardRef.current) return null;
    const rect = boardRef.current.getBoundingClientRect();
    const squareSize = rect.width / 8;

    return (
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: dragging.x - squareSize * 0.45,
          top: dragging.y - squareSize * 0.45,
          width: squareSize * 0.9,
          height: squareSize * 0.9,
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))',
        }}
      >
        <DragPiece size={45} />
      </div>
    );
  })() : null;

  return (
    <>
      <div className="glass-panel gold-glow p-1.5 rounded-xl">
        <div
          ref={boardRef}
          className="grid grid-cols-8 rounded-lg overflow-hidden border border-gold-dark/30"
          style={{ aspectRatio: '1' }}
        >
          {Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 8 }, (_, col) => renderSquare(row, col))
          )}
        </div>
      </div>
      {dragGhost}
    </>
  );
};

export default ChessBoard;
