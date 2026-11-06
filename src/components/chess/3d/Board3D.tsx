import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Square } from 'chess.js';

interface Board3DProps {
  flipped: boolean;
  selectedSquare: Square | null;
  validMoves: Square[];
  lastMove: { from: Square; to: Square } | null;
  isCheck: boolean;
  turn: 'w' | 'b';
  onSquareClick: (square: Square) => void;
}

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

const LIGHT_COLOR = new THREE.Color('#b8a67e');
const DARK_COLOR = new THREE.Color('#6b5838');
const SELECTED_COLOR = new THREE.Color('#ffd700');
const VALID_COLOR = new THREE.Color('#4ade80');
const LAST_MOVE_COLOR = new THREE.Color('#c9a227');
const CHECK_COLOR = new THREE.Color('#ef4444');

export function squareToWorld(square: Square, flipped: boolean): [number, number] {
  const file = square.charCodeAt(0) - 97;
  const rank = 8 - parseInt(square[1]);
  const col = flipped ? 7 - file : file;
  const row = flipped ? 7 - rank : rank;
  return [col - 3.5, row - 3.5];
}

const Board3D: React.FC<Board3DProps> = ({
  flipped,
  selectedSquare,
  validMoves,
  lastMove,
  isCheck,
  turn,
  onSquareClick,
}) => {
  const squares = useMemo(() => {
    const result: Array<{
      square: Square;
      worldX: number;
      worldZ: number;
      isLight: boolean;
    }> = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const r = flipped ? 7 - row : row;
        const c = flipped ? 7 - col : col;
        const square = `${files[c]}${ranks[r]}` as Square;
        result.push({
          square,
          worldX: col - 3.5,
          worldZ: row - 3.5,
          isLight: (row + col) % 2 === 0,
        });
      }
    }
    return result;
  }, [flipped]);

  return (
    <group>
      {/* Board base - lowered to avoid z-fighting with squares */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[8.6, 0.3, 8.6]} />
        <meshStandardMaterial color="#3d2b1f" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Board edge trim - sits just below square plane */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[8.2, 0.02, 8.2]} />
        <meshStandardMaterial color="#2a1f14" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Squares */}
      {squares.map(({ square, worldX, worldZ, isLight }) => {
        const isSelected = selectedSquare === square;
        const isValid = validMoves.includes(square);
        const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);

        let color = isLight ? LIGHT_COLOR : DARK_COLOR;
        let emissive = new THREE.Color('#000000');
        let emissiveIntensity = 0;

        if (isSelected) {
          emissive = SELECTED_COLOR;
          emissiveIntensity = 0.4;
        } else if (isLastMove) {
          emissive = LAST_MOVE_COLOR;
          emissiveIntensity = 0.2;
        }

        return (
          <group key={square}>
            <mesh
              position={[worldX, 0.01, worldZ]}
              rotation={[-Math.PI / 2, 0, 0]}
              
              onClick={(e) => {
                e.stopPropagation();
                onSquareClick(square);
              }}
            >
              <planeGeometry args={[1, 1]} />
              <meshStandardMaterial
                color={color}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
                metalness={0.1}
                roughness={0.8}
              />
            </mesh>

            {/* Valid move dot */}
            {isValid && (
              <mesh position={[worldX, 0.04, worldZ]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.15, 16]} />
                <meshStandardMaterial
                  color={VALID_COLOR}
                  emissive={VALID_COLOR}
                  emissiveIntensity={0.6}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

export default Board3D;
