'use client';

import type { BoardState } from '@/types';
import { QueenIcon } from './QueenIcon';
import { cn } from '@/lib/utils';
import React from 'react';

interface SolutionBoardProps {
  boardState: BoardState;
  solutionNumber: number;
}

const N = 8;
const colLabels = Array.from({ length: N }, (_, i) => String.fromCharCode(65 + i));
const rowLabels = Array.from({ length: N }, (_, i) => (N - i).toString()); // 8, 7, ..., 1

export function SolutionBoard({ boardState, solutionNumber }: SolutionBoardProps) {
  return (
    <div className="border border-muted-foreground rounded overflow-hidden shadow-sm">
      <p className="text-xs font-medium text-center py-1 bg-secondary text-secondary-foreground">
        Solution #{solutionNumber}
      </p>
      <div
        style={{
          gridTemplateColumns: `minmax(1.25rem, auto) repeat(${N}, minmax(0, 1fr)) minmax(1.25rem, auto)`,
          gridTemplateRows: `minmax(1.25rem, auto) repeat(${N}, minmax(0, 1fr)) minmax(1.25rem, auto)`,
        }}
        className="grid bg-card" // Removed border here as parent has it
        role="grid"
        aria-label={`Solution board ${solutionNumber}`}
      >
        {/* Top-left empty corner */}
        <div className="flex items-center justify-center p-0.5 text-xs font-medium text-muted-foreground" role="presentation"></div>
        {/* Column Labels (Top: A-H) */}
        {colLabels.map((label) => (
          <div key={`sol-top-col-${label}`} className="flex items-center justify-center p-0.5 text-xs font-medium text-muted-foreground" role="columnheader">
            {label}
          </div>
        ))}
        {/* Top-right empty corner */}
        <div className="flex items-center justify-center p-0.5 text-xs font-medium text-muted-foreground" role="presentation"></div>

        {/* Board rows with labels */}
        {rowLabels.map((rowLabel, rowIndex) => (
          <React.Fragment key={`sol-board-row-${rowIndex}`}>
            {/* Row Label (Left) */}
            <div className="flex items-center justify-center p-0.5 text-xs font-medium text-muted-foreground" role="rowheader">
              {rowLabel}
            </div>
            
            {/* Board Cells for this row */}
            {boardState[rowIndex].map((cell, colIndex) => {
              const isLightSquare = (rowIndex + colIndex) % 2 === 0;
              const isQueen = cell === 1;
              return (
                <div
                  key={`sol-${rowIndex}-${colIndex}`}
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
        ))}

        {/* Bottom-left empty corner */}
        <div className="flex items-center justify-center p-0.5 text-xs font-medium text-muted-foreground" role="presentation"></div>
        {/* Column Labels (Bottom: A-H) */}
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
