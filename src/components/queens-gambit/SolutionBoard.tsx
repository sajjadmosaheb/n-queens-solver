'use client';

import type { BoardState } from '@/types';
import { QueenIcon } from './QueenIcon';
import { cn } from '@/lib/utils';
import React from 'react';

interface SolutionBoardProps {
  boardState: BoardState;
  boardSize: number; // New prop for dynamic board size
  solutionNumber: number;
}

export function SolutionBoard({ boardState, boardSize, solutionNumber }: SolutionBoardProps) {
  const colLabels = Array.from({ length: boardSize }, (_, i) => String.fromCharCode(65 + i));
  const rowLabels = Array.from({ length: boardSize }, (_, i) => (boardSize - i).toString()); 

  return (
    <div className="border border-muted-foreground rounded overflow-hidden shadow-sm">
      <p className="text-xs font-medium text-center py-1 bg-secondary text-secondary-foreground">
        Solution #{solutionNumber} ({boardSize}x{boardSize})
      </p>
      <div
        style={{
          gridTemplateColumns: `minmax(1.25rem, auto) repeat(${boardSize}, minmax(0, 1fr)) minmax(1.25rem, auto)`,
          gridTemplateRows: `minmax(1.25rem, auto) repeat(${boardSize}, minmax(0, 1fr)) minmax(1.25rem, auto)`,
        }}
        className="grid bg-card" 
        role="grid"
        aria-label={`Solution board ${solutionNumber} for ${boardSize}x${boardSize} queens`}
      >
        {/* Top-left empty corner */}
        <div className="flex items-center justify-center p-0.5 text-xs font-medium text-muted-foreground" role="presentation"></div>
        {/* Column Labels (Top) */}
        {colLabels.map((label) => (
          <div key={`sol-top-col-${label}`} className="flex items-center justify-center p-0.5 text-xs font-medium text-muted-foreground" role="columnheader">
            {label}
          </div>
        ))}
        {/* Top-right empty corner */}
        <div className="flex items-center justify-center p-0.5 text-xs font-medium text-muted-foreground" role="presentation"></div>

        {/* Board rows with labels */}
        {rowLabels.map((rowLabel, rIndex) => {
           const actualRowIndex = boardSize - 1 - rIndex; // Convert visual row index to 0-based board index
          return (
            <React.Fragment key={`sol-board-row-${actualRowIndex}`}>
              {/* Row Label (Left) */}
              <div className="flex items-center justify-center p-0.5 text-xs font-medium text-muted-foreground" role="rowheader">
                {rowLabel}
              </div>
              
              {/* Board Cells for this row */}
              {Array.from({length: boardSize}).map((_, colIndex) => {
                const cell = boardState[actualRowIndex] && boardState[actualRowIndex][colIndex];
                const isLightSquare = (actualRowIndex + colIndex) % 2 === 0;
                const isQueen = cell === 1;
                return (
                  <div
                    key={`sol-${actualRowIndex}-${colIndex}`}
                    role="gridcell"
                    aria-label={`Square ${colLabels[colIndex]}${rowLabel}${isQueen ? ', Queen' : ''}`}
                    className={cn(
                      'aspect-square flex items-center justify-center',
                      isLightSquare ? 'bg-[hsl(var(--board-light-square))]' : 'bg-[hsl(var(--board-dark-square))]'
                    )}
                  >
                    {isQueen && (
                      <div className="w-3/4 h-3/4 p-px">
                        <QueenIcon style={{ fill: 'hsl(var(--queen-gold))', stroke: 'hsl(var(--foreground))', strokeWidth: '1px' }} />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Row Label (Right) */}
              <div className="flex items-center justify-center p-0.5 text-xs font-medium text-muted-foreground" role="rowheader">
                {rowLabel}
              </div>
            </React.Fragment>
          );
        })}

        {/* Bottom-left empty corner */}
        <div className="flex items-center justify-center p-0.5 text-xs font-medium text-muted-foreground" role="presentation"></div>
        {/* Column Labels (Bottom) */}
        {colLabels.map((label) => (
          <div key={`sol-bottom-col-${label}`} className="flex items-center justify-center p-0.5 text-xs font-medium text-muted-foreground" role="columnheader">
            {label}
          </div>
        ))}
        {/* Bottom-right empty corner */}
        <div className="flex items-center justify-center p-0.5 text-xs font-medium text-muted-foreground" role="presentation"></div>
      </div>
    </div>
  );
}
