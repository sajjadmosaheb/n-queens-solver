'use client';

import type { BoardState } from '@/types';
import { QueenIcon } from './QueenIcon';
import { cn } from '@/lib/utils';

interface SolutionBoardProps {
  boardState: BoardState;
  solutionNumber: number;
}

const N = 8;

export function SolutionBoard({ boardState, solutionNumber }: SolutionBoardProps) {
  return (
    <div className="border border-muted-foreground rounded overflow-hidden shadow-sm">
      <p className="text-xs font-medium text-center py-1 bg-secondary text-secondary-foreground">
        Solution #{solutionNumber}
      </p>
      <div className="grid grid-cols-8 aspect-square">
        {boardState.map((rowArr, rowIndex) =>
          rowArr.map((cell, colIndex) => {
            const isLightSquare = (rowIndex + colIndex) % 2 === 0;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  'aspect-square flex items-center justify-center',
                  isLightSquare ? 'bg-[hsl(var(--board-light-square))]' : 'bg-[hsl(var(--board-dark-square))]'
                )}
              >
                {cell === 1 && (
                  <div className="w-3/4 h-3/4 p-px">
                    <QueenIcon style={{ fill: '#FFD700', stroke: 'black', strokeWidth: '1px' }} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
