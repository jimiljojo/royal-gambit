import { useState, useCallback, useMemo } from 'react';
import { Chess, Square, Move } from 'chess.js';

export interface GameState {
  fen: string;
  turn: 'w' | 'b';
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  moveHistory: Move[];
  capturedPieces: { w: string[]; b: string[] };
  lastMove: { from: Square; to: Square } | null;
}

export function useChessGame() {
  const [game] = useState(() => new Chess());
  const [gameState, setGameState] = useState<GameState>(() => getState(game));
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [promotionPending, setPromotionPending] = useState<{ from: Square; to: Square } | null>(null);

  function getState(g: Chess): GameState {
    const history = g.history({ verbose: true });
    const captured: { w: string[]; b: string[] } = { w: [], b: [] };
    history.forEach((m) => {
      if (m.captured) {
        // If white captured, the captured piece was black
        if (m.color === 'w') captured.b.push(m.captured);
        else captured.w.push(m.captured);
      }
    });
    const lastMove = history.length > 0
      ? { from: history[history.length - 1].from, to: history[history.length - 1].to }
      : null;

    return {
      fen: g.fen(),
      turn: g.turn() as 'w' | 'b',
      isCheck: g.isCheck(),
      isCheckmate: g.isCheckmate(),
      isStalemate: g.isStalemate(),
      isDraw: g.isDraw(),
      isGameOver: g.isGameOver(),
      moveHistory: history,
      capturedPieces: captured,
      lastMove,
    };
  }

  const updateState = useCallback(() => {
    setGameState(getState(game));
  }, [game]);

  const handleSquareClick = useCallback((square: Square) => {
    if (gameState.isGameOver) return;

    const piece = game.get(square);

    if (selectedSquare) {
      // Try to move
      if (validMoves.includes(square)) {
        // Check for promotion
        const movingPiece = game.get(selectedSquare);
        if (
          movingPiece?.type === 'p' &&
          ((movingPiece.color === 'w' && square[1] === '8') ||
            (movingPiece.color === 'b' && square[1] === '1'))
        ) {
          setPromotionPending({ from: selectedSquare, to: square });
          setSelectedSquare(null);
          setValidMoves([]);
          return;
        }

        try {
          game.move({ from: selectedSquare, to: square });
          updateState();
        } catch {}
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }

      // Select a different piece of same color
      if (piece && piece.color === gameState.turn) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setValidMoves(moves.map((m) => m.to));
        return;
      }

      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    // Select piece
    if (piece && piece.color === gameState.turn) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setValidMoves(moves.map((m) => m.to));
    }
  }, [game, gameState, selectedSquare, validMoves, updateState]);

  const handlePromotion = useCallback((promoteTo: 'q' | 'r' | 'b' | 'n') => {
    if (!promotionPending) return;
    try {
      game.move({ from: promotionPending.from, to: promotionPending.to, promotion: promoteTo });
      updateState();
    } catch {}
    setPromotionPending(null);
  }, [game, promotionPending, updateState]);

  const makeMove = useCallback((from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n') => {
    try {
      game.move({ from, to, promotion });
      updateState();
      return true;
    } catch {
      return false;
    }
  }, [game, updateState]);

  const undoMove = useCallback(() => {
    game.undo();
    updateState();
    setSelectedSquare(null);
    setValidMoves([]);
  }, [game, updateState]);

  const resetGame = useCallback(() => {
    game.reset();
    updateState();
    setSelectedSquare(null);
    setValidMoves([]);
    setPromotionPending(null);
  }, [game, updateState]);

  const flipBoard = useCallback(() => {
    setBoardFlipped((prev) => !prev);
  }, []);

  const board = useMemo(() => {
    return game.board();
  }, [gameState.fen]);

  return {
    gameState,
    board,
    selectedSquare,
    validMoves,
    boardFlipped,
    promotionPending,
    handleSquareClick,
    handlePromotion,
    makeMove,
    undoMove,
    resetGame,
    flipBoard,
    game,
  };
}
