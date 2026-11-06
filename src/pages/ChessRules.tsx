import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { pieceComponents } from '@/components/chess/ChessPieces';

// ── Types ──
type SquareHighlight = 'move' | 'capture' | 'piece' | 'special';

interface BoardSetup {
  pieces: { square: string; piece: string }[]; // e.g. { square: 'e4', piece: 'wN' }
  highlights: { square: string; type: SquareHighlight }[];
}

interface Lesson {
  title: string;
  icon: string;
  sections: {
    heading: string;
    text: string;
    board: BoardSetup;
  }[];
}

// ── Helpers ──
const files = 'abcdefgh';
const squareToPos = (sq: string) => ({ col: files.indexOf(sq[0]), row: 8 - parseInt(sq[1]) });

// ── Mini Board ──
const MiniBoard: React.FC<{ setup: BoardSetup }> = ({ setup }) => {
  const pieceMap = new Map(setup.pieces.map(p => [p.square, p.piece]));
  const highlightMap = new Map(setup.highlights.map(h => [h.square, h.type]));

  return (
    <div className="inline-grid grid-cols-8 rounded-lg overflow-hidden border border-border/50 w-full max-w-[320px]">
      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 8 }, (_, col) => {
          const sq = `${files[col]}${8 - row}`;
          const isLight = (row + col) % 2 === 0;
          const piece = pieceMap.get(sq);
          const highlight = highlightMap.get(sq);
          const PieceComp = piece ? pieceComponents[piece] : null;

          return (
            <div
              key={sq}
              className={cn(
                'aspect-square flex items-center justify-center relative',
                isLight ? 'bg-board-light' : 'bg-board-dark',
                highlight === 'move' && 'bg-emerald-500/30',
                highlight === 'capture' && 'bg-red-400/30',
                highlight === 'piece' && 'ring-2 ring-inset ring-primary',
                highlight === 'special' && 'bg-primary/25',
              )}
            >
              {highlight === 'move' && !piece && (
                <div className="w-[28%] h-[28%] rounded-full bg-emerald-400/60" />
              )}
              {highlight === 'capture' && piece && (
                <div className="absolute inset-0 border-[3px] border-red-400/60 rounded-sm" />
              )}
              {PieceComp && (
                <div className="w-[80%] h-[80%]">
                  <PieceComp size={36} />
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

// ── Lesson Data ──
const lessons: Lesson[] = [
  {
    title: 'The King',
    icon: '♚',
    sections: [
      {
        heading: 'How the King Moves',
        text: 'The King can move exactly one square in any direction — horizontally, vertically, or diagonally. He is the most important piece; if your King is checkmated, you lose the game.',
        board: {
          pieces: [{ square: 'e4', piece: 'wK' }],
          highlights: [
            { square: 'e4', type: 'piece' },
            { square: 'd5', type: 'move' }, { square: 'e5', type: 'move' }, { square: 'f5', type: 'move' },
            { square: 'd4', type: 'move' }, { square: 'f4', type: 'move' },
            { square: 'd3', type: 'move' }, { square: 'e3', type: 'move' }, { square: 'f3', type: 'move' },
          ],
        },
      },
    ],
  },
  {
    title: 'The Queen',
    icon: '♛',
    sections: [
      {
        heading: 'How the Queen Moves',
        text: 'The Queen is the most powerful piece. She can move any number of squares along a rank, file, or diagonal — combining the power of the Rook and Bishop.',
        board: {
          pieces: [{ square: 'd4', piece: 'wQ' }],
          highlights: [
            { square: 'd4', type: 'piece' },
            // File
            { square: 'd1', type: 'move' }, { square: 'd2', type: 'move' }, { square: 'd3', type: 'move' },
            { square: 'd5', type: 'move' }, { square: 'd6', type: 'move' }, { square: 'd7', type: 'move' }, { square: 'd8', type: 'move' },
            // Rank
            { square: 'a4', type: 'move' }, { square: 'b4', type: 'move' }, { square: 'c4', type: 'move' },
            { square: 'e4', type: 'move' }, { square: 'f4', type: 'move' }, { square: 'g4', type: 'move' }, { square: 'h4', type: 'move' },
            // Diagonals
            { square: 'c3', type: 'move' }, { square: 'b2', type: 'move' }, { square: 'a1', type: 'move' },
            { square: 'e5', type: 'move' }, { square: 'f6', type: 'move' }, { square: 'g7', type: 'move' }, { square: 'h8', type: 'move' },
            { square: 'c5', type: 'move' }, { square: 'b6', type: 'move' }, { square: 'a7', type: 'move' },
            { square: 'e3', type: 'move' }, { square: 'f2', type: 'move' }, { square: 'g1', type: 'move' },
          ],
        },
      },
    ],
  },
  {
    title: 'The Rook',
    icon: '♜',
    sections: [
      {
        heading: 'How the Rook Moves',
        text: 'The Rook moves any number of squares along a rank (row) or file (column). It cannot jump over other pieces. Rooks are powerful in the endgame and work best on open files.',
        board: {
          pieces: [{ square: 'd4', piece: 'wR' }],
          highlights: [
            { square: 'd4', type: 'piece' },
            { square: 'd1', type: 'move' }, { square: 'd2', type: 'move' }, { square: 'd3', type: 'move' },
            { square: 'd5', type: 'move' }, { square: 'd6', type: 'move' }, { square: 'd7', type: 'move' }, { square: 'd8', type: 'move' },
            { square: 'a4', type: 'move' }, { square: 'b4', type: 'move' }, { square: 'c4', type: 'move' },
            { square: 'e4', type: 'move' }, { square: 'f4', type: 'move' }, { square: 'g4', type: 'move' }, { square: 'h4', type: 'move' },
          ],
        },
      },
    ],
  },
  {
    title: 'The Bishop',
    icon: '♝',
    sections: [
      {
        heading: 'How the Bishop Moves',
        text: 'The Bishop moves diagonally any number of squares. Each Bishop stays on its starting color for the entire game — one on light squares and one on dark squares.',
        board: {
          pieces: [{ square: 'd4', piece: 'wB' }],
          highlights: [
            { square: 'd4', type: 'piece' },
            { square: 'c3', type: 'move' }, { square: 'b2', type: 'move' }, { square: 'a1', type: 'move' },
            { square: 'e5', type: 'move' }, { square: 'f6', type: 'move' }, { square: 'g7', type: 'move' }, { square: 'h8', type: 'move' },
            { square: 'c5', type: 'move' }, { square: 'b6', type: 'move' }, { square: 'a7', type: 'move' },
            { square: 'e3', type: 'move' }, { square: 'f2', type: 'move' }, { square: 'g1', type: 'move' },
          ],
        },
      },
    ],
  },
  {
    title: 'The Knight',
    icon: '♞',
    sections: [
      {
        heading: 'How the Knight Moves',
        text: 'The Knight moves in an "L" shape: two squares in one direction and one square perpendicular (or vice versa). It is the only piece that can jump over other pieces!',
        board: {
          pieces: [{ square: 'd4', piece: 'wN' }],
          highlights: [
            { square: 'd4', type: 'piece' },
            { square: 'c6', type: 'move' }, { square: 'e6', type: 'move' },
            { square: 'b5', type: 'move' }, { square: 'f5', type: 'move' },
            { square: 'b3', type: 'move' }, { square: 'f3', type: 'move' },
            { square: 'c2', type: 'move' }, { square: 'e2', type: 'move' },
          ],
        },
      },
    ],
  },
  {
    title: 'The Pawn',
    icon: '♟',
    sections: [
      {
        heading: 'How the Pawn Moves',
        text: 'Pawns move forward one square, but capture diagonally. On their first move, they can advance two squares. Pawns can only move forward, never backward.',
        board: {
          pieces: [
            { square: 'e2', piece: 'wP' },
            { square: 'd5', piece: 'wP' },
            { square: 'c6', piece: 'bN' },
            { square: 'e6', piece: 'bB' },
          ],
          highlights: [
            { square: 'e2', type: 'piece' },
            { square: 'e3', type: 'move' }, { square: 'e4', type: 'move' },
            { square: 'd5', type: 'piece' },
            { square: 'd6', type: 'move' },
            { square: 'c6', type: 'capture' }, { square: 'e6', type: 'capture' },
          ],
        },
      },
    ],
  },
  {
    title: 'Castling',
    icon: '🏰',
    sections: [
      {
        heading: 'Kingside Castling',
        text: 'Castling is a special move involving the King and a Rook. The King moves two squares toward the Rook, and the Rook jumps to the other side. Neither piece can have moved before, the King cannot be in check, and the squares the King passes through must be safe.',
        board: {
          pieces: [
            { square: 'e1', piece: 'wK' }, { square: 'h1', piece: 'wR' },
          ],
          highlights: [
            { square: 'e1', type: 'piece' }, { square: 'h1', type: 'piece' },
            { square: 'f1', type: 'move' }, { square: 'g1', type: 'special' },
          ],
        },
      },
      {
        heading: 'Queenside Castling',
        text: 'The King can also castle to the queenside. The King moves two squares toward the a-file Rook, and the Rook jumps to the other side.',
        board: {
          pieces: [
            { square: 'e1', piece: 'wK' }, { square: 'a1', piece: 'wR' },
          ],
          highlights: [
            { square: 'e1', type: 'piece' }, { square: 'a1', type: 'piece' },
            { square: 'd1', type: 'move' }, { square: 'c1', type: 'special' },
          ],
        },
      },
    ],
  },
  {
    title: 'En Passant',
    icon: '⚡',
    sections: [
      {
        heading: 'En Passant Capture',
        text: 'If a pawn advances two squares from its starting position and lands beside an opponent\'s pawn, the opponent can capture it "in passing" on the very next move — as if the pawn had only moved one square forward.',
        board: {
          pieces: [
            { square: 'e5', piece: 'wP' },
            { square: 'd7', piece: 'bP' },
          ],
          highlights: [
            { square: 'e5', type: 'piece' },
            { square: 'd5', type: 'special' },
            { square: 'd6', type: 'capture' },
          ],
        },
      },
    ],
  },
  {
    title: 'Promotion',
    icon: '👑',
    sections: [
      {
        heading: 'Pawn Promotion',
        text: 'When a pawn reaches the opposite end of the board (8th rank for White, 1st rank for Black), it must be promoted to a Queen, Rook, Bishop, or Knight. Most players promote to a Queen since it\'s the most powerful piece.',
        board: {
          pieces: [
            { square: 'e7', piece: 'wP' },
          ],
          highlights: [
            { square: 'e7', type: 'piece' },
            { square: 'e8', type: 'special' },
          ],
        },
      },
    ],
  },
  {
    title: 'Check & Checkmate',
    icon: '⚔️',
    sections: [
      {
        heading: 'Check',
        text: 'When a piece attacks the opponent\'s King, the King is "in check." The player must immediately get out of check by moving the King, blocking the attack, or capturing the attacker.',
        board: {
          pieces: [
            { square: 'e1', piece: 'wK' }, { square: 'e8', piece: 'bR' },
          ],
          highlights: [
            { square: 'e1', type: 'piece' },
            { square: 'e8', type: 'capture' },
            { square: 'd1', type: 'move' }, { square: 'f1', type: 'move' }, { square: 'd2', type: 'move' }, { square: 'f2', type: 'move' },
          ],
        },
      },
      {
        heading: 'Checkmate',
        text: 'Checkmate occurs when the King is in check and there is no legal move to escape. The game is over! The attacker wins.',
        board: {
          pieces: [
            { square: 'h1', piece: 'wK' }, { square: 'g1', piece: 'wR' },
            { square: 'a1', piece: 'bR' }, { square: 'a2', piece: 'bR' },
          ],
          highlights: [
            { square: 'h1', type: 'piece' },
            { square: 'a1', type: 'capture' },
            { square: 'a2', type: 'capture' },
          ],
        },
      },
    ],
  },
  {
    title: 'Basic Strategy',
    icon: '🧠',
    sections: [
      {
        heading: 'Control the Center',
        text: 'The four center squares (e4, d4, e5, d5) are the most important. Pieces placed in or near the center control more of the board and can reach any part of it more quickly.',
        board: {
          pieces: [
            { square: 'e4', piece: 'wP' }, { square: 'd4', piece: 'wP' },
            { square: 'f3', piece: 'wN' }, { square: 'c3', piece: 'wN' },
          ],
          highlights: [
            { square: 'e4', type: 'special' }, { square: 'd4', type: 'special' },
            { square: 'e5', type: 'special' }, { square: 'd5', type: 'special' },
          ],
        },
      },
      {
        heading: 'Develop Your Pieces',
        text: 'In the opening, bring your Knights and Bishops out early. Don\'t move the same piece twice without good reason. Castle early to protect your King and connect your Rooks.',
        board: {
          pieces: [
            { square: 'e1', piece: 'wK' }, { square: 'd1', piece: 'wQ' },
            { square: 'c4', piece: 'wB' }, { square: 'f3', piece: 'wN' },
            { square: 'e4', piece: 'wP' }, { square: 'd3', piece: 'wP' },
            { square: 'a1', piece: 'wR' }, { square: 'h1', piece: 'wR' },
          ],
          highlights: [
            { square: 'c4', type: 'special' }, { square: 'f3', type: 'special' },
          ],
        },
      },
    ],
  },
];

const ChessRules: React.FC = () => {
  const navigate = useNavigate();
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);

  const lesson = lessons[activeLessonIdx];
  const section = lesson.sections[activeSectionIdx];

  const goNext = () => {
    if (activeSectionIdx < lesson.sections.length - 1) {
      setActiveSectionIdx(activeSectionIdx + 1);
    } else if (activeLessonIdx < lessons.length - 1) {
      setActiveLessonIdx(activeLessonIdx + 1);
      setActiveSectionIdx(0);
    }
  };

  const goPrev = () => {
    if (activeSectionIdx > 0) {
      setActiveSectionIdx(activeSectionIdx - 1);
    } else if (activeLessonIdx > 0) {
      setActiveLessonIdx(activeLessonIdx - 1);
      setActiveSectionIdx(lessons[activeLessonIdx - 1].sections.length - 1);
    }
  };

  const isFirst = activeLessonIdx === 0 && activeSectionIdx === 0;
  const isLast = activeLessonIdx === lessons.length - 1 && activeSectionIdx === lesson.sections.length - 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="font-display text-primary gap-2">
          <Home className="w-4 h-4" /> Royal Chess
        </Button>
        <span className="text-xs font-display text-primary uppercase tracking-wider">Chess Rules</span>
        <div className="w-20" />
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-4 lg:p-8 max-w-6xl mx-auto w-full">
        {/* Sidebar: lesson list */}
        <nav className="lg:w-56 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {lessons.map((l, i) => (
            <button
              key={l.title}
              onClick={() => { setActiveLessonIdx(i); setActiveSectionIdx(0); }}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body whitespace-nowrap transition-colors',
                i === activeLessonIdx
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:bg-secondary/50'
              )}
            >
              <span className="text-lg">{l.icon}</span>
              <span>{l.title}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center gap-6">
          <div className="glass-panel gold-glow p-6 w-full max-w-xl space-y-4">
            <h2 className="font-display text-xl gold-text flex items-center gap-2">
              <span className="text-2xl">{lesson.icon}</span>
              {section.heading}
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              {section.text}
            </p>
          </div>

          <MiniBoard setup={section.board} />

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={goPrev} disabled={isFirst} className="gap-1">
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <span className="text-xs text-muted-foreground font-body">
              {activeLessonIdx + 1}/{lessons.length}
              {lesson.sections.length > 1 && ` · ${activeSectionIdx + 1}/${lesson.sections.length}`}
            </span>
            <Button variant="outline" size="sm" onClick={goNext} disabled={isLast} className="gap-1">
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChessRules;
