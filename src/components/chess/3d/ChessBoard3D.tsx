import React, { Suspense, useMemo, useRef, useState, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Square } from 'chess.js';
import Board3D, { squareToWorld } from './Board3D';
import ChessPiece3D from './ChessPiece3D';

interface ChessBoard3DProps {
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

const Scene: React.FC<ChessBoard3DProps> = ({
  board,
  flipped,
  selectedSquare,
  validMoves,
  lastMove,
  isCheck,
  turn,
  onSquareClick,
}) => {
  const prevPiecesRef = useRef<Map<string, { square: Square; type: string; color: 'w' | 'b' }>>(new Map());

  const pieces = useMemo(() => {
    const currentPieces: Array<{
      square: Square;
      type: string;
      color: 'w' | 'b';
      worldPos: [number, number, number];
    }> = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row]?.[col];
        if (piece) {
          const square = `${files[col]}${ranks[row]}` as Square;
          const [wx, wz] = squareToWorld(square, flipped);
          currentPieces.push({
            square,
            type: piece.type,
            color: piece.color as 'w' | 'b',
            worldPos: [wx, 0.01, wz],
          });
        }
      }
    }

    const newMap = new Map<string, { square: Square; type: string; color: 'w' | 'b' }>();
    const usedKeys = new Set<string>();

    if (lastMove) {
      const movedPiece = currentPieces.find(p => p.square === lastMove.to);
      const oldKey = Array.from(prevPiecesRef.current.entries()).find(
        ([, v]) => v.square === lastMove.from && movedPiece && v.type === movedPiece.type && v.color === movedPiece.color
      );
      if (movedPiece && oldKey) {
        newMap.set(oldKey[0], { square: movedPiece.square, type: movedPiece.type, color: movedPiece.color });
        usedKeys.add(oldKey[0]);
      }
    }

    let idCounter = 0;
    for (const p of currentPieces) {
      const alreadyMapped = Array.from(newMap.values()).some(v => v.square === p.square);
      if (alreadyMapped) continue;

      const existingKey = Array.from(prevPiecesRef.current.entries()).find(
        ([key, v]) => !usedKeys.has(key) && v.square === p.square && v.type === p.type && v.color === p.color
      );
      if (existingKey) {
        newMap.set(existingKey[0], { square: p.square, type: p.type, color: p.color });
        usedKeys.add(existingKey[0]);
      } else {
        const newKey = `${p.color}${p.type}_${idCounter++}_${Date.now()}`;
        newMap.set(newKey, { square: p.square, type: p.type, color: p.color });
      }
    }

    prevPiecesRef.current = newMap;

    return currentPieces.map(p => {
      const entry = Array.from(newMap.entries()).find(([, v]) => v.square === p.square);
      return {
        ...p,
        key: entry ? entry[0] : p.square,
      };
    });
  }, [board, flipped, lastMove]);

  const { invalidate } = useThree();

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={flipped ? [0, 8, -7] : [0, 8, 7]}
        fov={45}
        near={0.5}
        far={50}
      />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableDamping={false}
        rotateSpeed={0.5}
        minDistance={6}
        maxDistance={18}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.5}
        target={[0, 0, 0]}
        mouseButtons={{ LEFT: undefined as any, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }}
        onChange={() => invalidate()}
      />

      {/* Lighting - simplified, no shadows to reduce GPU load */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.0} />
      <directionalLight position={[-3, 6, -3]} intensity={0.3} />

      <Board3D
        flipped={flipped}
        selectedSquare={selectedSquare}
        validMoves={validMoves}
        lastMove={lastMove}
        isCheck={isCheck}
        turn={turn}
        onSquareClick={onSquareClick}
      />

      {pieces.map(({ key, square, type, color, worldPos }) => (
        <ChessPiece3D
          key={key}
          type={type}
          color={color}
          position={worldPos}
          isSelected={selectedSquare === square}
          onClick={() => onSquareClick(square)}
        />
      ))}
    </>
  );
};

const ChessBoard3D: React.FC<ChessBoard3DProps> = (props) => {
  const [canvasKey, setCanvasKey] = useState(0);

  const handleCreated = useCallback(({ gl }: { gl: THREE.WebGLRenderer }) => {
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      console.warn('WebGL context lost, will restore...');
    });
    canvas.addEventListener('webglcontextrestored', () => {
      console.info('WebGL context restored');
      setCanvasKey(k => k + 1);
    });
  }, []);

  return (
    <div className="glass-panel gold-glow rounded-xl overflow-hidden w-full" style={{ aspectRatio: '1' }}>
      <Canvas
        key={canvasKey}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'default',
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: true,
          failIfMajorPerformanceCaveat: false,
        }}
        frameloop="always"
        dpr={[1, 1.5]}
        style={{ background: '#1a1510' }}
        onCreated={handleCreated}
      >
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ChessBoard3D;
