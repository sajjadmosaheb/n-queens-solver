'use client';

import type { BoardState, QueenPosition } from '@/types';
import { QueenIcon } from './QueenIcon';
import { cn } from '@/lib/utils';
import React from 'react';

interface ChessboardProps {
  boardState: BoardState;
  boardSize: number; // New prop for dynamic board size
  onSquareClick?: (row: number, col: number) => void;
  interactive: boolean;
  activeQueen?: QueenPosition;
  conflictingQueens?: QueenPosition[];
}

export function Chessboard({
  boardState,
  boardSize,
  onSquareClick,
  interactive,
  activeQueen,
  conflictingQueens,
}: ChessboardProps) {
  const colLabels = Array.from({ length: boardSize }, (_, i) => String.fromCharCode(65 + i));
  const rowLabels = Array.from({ length: boardSize }, (_, i) => (boardSize - i).toString());

  return (
    <div className="max-w-md mx-auto md:max-w-lg lg:max-w-xl p-1">
      <div
        style={{
          gridTemplateColumns: `minmax(1.5rem, auto) repeat(${boardSize}, minmax(0, 1fr)) minmax(1.5rem, auto)`,
          gridTemplateRows: `minmax(1.5rem, auto) repeat(${boardSize}, minmax(0, 1fr)) minmax(1.5rem, auto)`,
        }}
        className="grid border border-border shadow-lg rounded overflow-hidden bg-card"
        role="grid"
        aria-label={`Chessboard ${boardSize}x${boardSize}`}
      >
        {/* Top-left empty corner */}
        <div className="flex items-center justify-center p-1 text-sm font-medium text-muted-foreground" role="presentation"></div>
        {/* Column Labels (Top) */}
        {colLabels.map((label) => (
          <div key={`top-col-${label}`} className="flex items-center justify-center p-1 text-sm font-medium text-muted-foreground" role="columnheader">
            {label}
          </div>
        ))}
        {/* Top-right empty corner */}
        <div className="flex items-center justify-center p-1 text-sm font-medium text-muted-foreground" role="presentation"></div>

        {/* Board rows with labels */}
        {rowLabels.map((rowLabel, rIndex) => {
          const actualRowIndex = boardSize - 1 - rIndex; // Convert visual row index to 0-based board index
          return (
            <React.Fragment key={`board-row-${actualRowIndex}`}>
              {/* Row Label (Left) */}
              <div className="flex items-center justify-center p-1 text-sm font-medium text-muted-foreground" role="rowheader">
                {rowLabel}
              </div>
              
              {/* Board Cells for this row */}
              {Array.from({ length: boardSize }).map((_, colIndex) => {
                const cell = boardState[actualRowIndex] && boardState[actualRowIndex][colIndex];
                const isLightSquare = (actualRowIndex + colIndex) % 2 === 0;
                const isQueen = cell === 1;
                const isActive = activeQueen?.row === actualRowIndex && activeQueen?.col === colIndex;
                const isConflict = conflictingQueens?.some(q => q.row === actualRowIndex && q.col === colIndex);
                
                return (
                  <div
                    key={`${actualRowIndex}-${colIndex}`}
                    role="gridcell"
                    aria-label={`Square ${colLabels[colIndex]}${rowLabel}${isQueen ? ', Queen' : ''}`}
                    className={cn(
                      'aspect-square flex items-center justify-center relative transition-colors duration-300',
                      isLightSquare ? 'bg-[hsl(var(--board-light-square))]' : 'bg-[hsl(var(--board-dark-square))]',
                      interactive && 'cursor-pointer hover:opacity-80',
                      isActive && !isConflict && 'ring-2 ring-offset-1 ring-[hsl(var(--highlight-current-step))] z-10',
                      isConflict && 'ring-2 ring-offset-1 ring-[hsl(var(--highlight-conflict))] z-10 opacity-80'
                    )}
                    onClick={() => interactive && onSquareClick?.(actualRowIndex, colIndex)}
                  >
                    {isQueen && (
                       <div className="w-3/4 h-3/4 p-px">
                          <QueenIcon style={{ fill: 'hsl(var(--queen-gold))', stroke: 'hsl(var(--foreground))', strokeWidth: '1px' }} />
                       </div>
                    )}
                     {isActive && !isQueen && (
                      <div className="absolute inset-1 border-2 border-dashed border-[hsl(var(--highlight-current-step))] rounded opacity-70" />
                    )}
                  </div>
                );
              })}

              {/* Row Label (Right) */}
              <div className="flex items-center justify-center p-1 text-sm font-medium text-muted-foreground" role="rowheader">
                {rowLabel}
              </div>
            </React.Fragment>
          );
        })}

        {/* Bottom-left empty corner */}
        <div className="flex items-center justify-center p-1 text-sm font-medium text-muted-foreground" role="presentation"></div>
        {/* Column Labels (Bottom) */}
        {colLabels.map((label) => (
          <div key={`bottom-col-${label}`} className="flex items-center justify-center p-1 text-sm font-medium text-muted-foreground" role="columnheader">
            {label}
          </div>
        ))}
        {/* Bottom-right empty corner */}
        <div className="flex items-center justify-center p-1 text-sm font-medium text-muted-foreground" role="presentation"></div>
      </div>
    </div>
  );
}
