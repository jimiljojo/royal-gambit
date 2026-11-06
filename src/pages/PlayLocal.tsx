import React from 'react';
import ChessBoard3D from '@/components/chess/3d/ChessBoard3D';
import MoveHistory from '@/components/chess/MoveHistory';
import CapturedPieces from '@/components/chess/CapturedPieces';
import GameStatus from '@/components/chess/GameStatus';
import PromotionDialog from '@/components/chess/PromotionDialog';
import { useChessGame } from '@/hooks/useChessGame';
import { Button } from '@/components/ui/button';
import { RotateCcw, FlipVertical, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlayLocal: React.FC = () => {
  const navigate = useNavigate();
  const {
    gameState,
    board,
    selectedSquare,
    validMoves,
    boardFlipped,
    promotionPending,
    handleSquareClick,
    handlePromotion,
    undoMove,
    resetGame,
    flipBoard,
  } = useChessGame();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="font-display text-primary gap-2">
          <Home className="w-4 h-4" />
          Royal Chess
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={flipBoard} className="gap-1.5">
            <FlipVertical className="w-4 h-4" /> Flip
          </Button>
          <Button variant="outline" size="sm" onClick={undoMove} className="gap-1.5">
            <RotateCcw className="w-4 h-4" /> Undo
          </Button>
          <Button variant="secondary" size="sm" onClick={resetGame}>
            New Game
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 gap-6 flex-col lg:flex-row">
        {/* Board */}
        <div className="w-full max-w-[min(85vh,720px)]">
          <ChessBoard3D
            board={board}
            flipped={boardFlipped}
            selectedSquare={selectedSquare}
            validMoves={validMoves}
            lastMove={gameState.lastMove}
            isCheck={gameState.isCheck}
            turn={gameState.turn}
            onSquareClick={handleSquareClick}
            gameOver={gameState.isGameOver}
          />
        </div>

        {/* Side panel */}
        <div className="w-full lg:w-64 flex flex-col gap-3">
          <GameStatus gameState={gameState} />
          <CapturedPieces captured={gameState.capturedPieces} />
          <MoveHistory moves={gameState.moveHistory} />
        </div>
      </main>

      {/* Promotion dialog */}
      <PromotionDialog
        open={!!promotionPending}
        color={gameState.turn}
        onSelect={handlePromotion}
      />
    </div>
  );
};

export default PlayLocal;
