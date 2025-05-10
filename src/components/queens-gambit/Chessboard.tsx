'use client';

import type { BoardState, QueenPosition } from '@/types';
import { QueenIcon } from './QueenIcon';
import { cn } from '@/lib/utils';

interface ChessboardProps {
  boardState: BoardState;
  onSquareClick?: (row: number, col: number) => void;
  interactive: boolean;
  activeQueen?: QueenPosition;
  conflictingQueens?: QueenPosition[];
}

const N = 8;

export function Chessboard({
  boardState,
  onSquareClick,
  interactive,
  activeQueen,
  conflictingQueens,
}: ChessboardProps) {
  return (
    <div className="grid grid-cols-8 aspect-square border-2 border-black shadow-lg rounded overflow-hidden max-w-md mx-auto md:max-w-lg lg:max-w-xl">
      {boardState.map((rowArr, rowIndex) =>
        rowArr.map((cell, colIndex) => {
          const isLightSquare = (rowIndex + colIndex) % 2 === 0;
          const isQueen = cell === 1;
          
          const isActive = activeQueen?.row === rowIndex && activeQueen?.col === colIndex;
          const isConflict = conflictingQueens?.some(q => q.row === rowIndex && q.col === colIndex);

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                'aspect-square flex items-center justify-center relative transition-colors duration-300',
                isLightSquare ? 'bg-[hsl(var(--board-light-square))]' : 'bg-[hsl(var(--board-dark-square))]',
                interactive && 'cursor-pointer hover:opacity-80',
                isActive && !isConflict && 'ring-2 ring-offset-1 ring-[hsl(var(--highlight-current-step))] z-10',
                isConflict && 'ring-2 ring-offset-1 ring-[hsl(var(--highlight-conflict))] z-10 opacity-80'
              )}
              onClick={() => interactive && onSquareClick?.(rowIndex, colIndex)}
              aria-label={`Square ${String.fromCharCode(65 + colIndex)}${rowIndex + 1}${isQueen ? ', Queen' : ''}`}
            >
              {isQueen && (
                 <div className="w-3/4 h-3/4 p-px">
                    <QueenIcon style={{ fill: '#FFD700', stroke: 'black', strokeWidth: '1px' }} />
                 </div>
              )}
               {isActive && !isQueen && (
                <div className="absolute inset-1 border-2 border-dashed border-[hsl(var(--highlight-current-step))] rounded opacity-70" />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
