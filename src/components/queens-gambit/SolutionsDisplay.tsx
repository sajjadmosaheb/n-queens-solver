'use client';

import type { Solution } from '@/types';
import { SolutionBoard } from './SolutionBoard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SolutionsDisplayProps {
  solutions: Solution[];
  boardSize: number;
  onSolutionClick?: (solution: Solution) => void; // Added for click handling
}

export function SolutionsDisplay({ solutions, boardSize, onSolutionClick }: SolutionsDisplayProps) {
  return (
    <Card className="shadow-md h-full flex flex-col">
      <CardHeader>
        <CardTitle>Solutions Found</CardTitle>
        <CardDescription>
          {solutions.length > 0 
            ? `Displaying ${solutions.length} solution(s) for ${boardSize}x${boardSize}. Hover for preview, click to display on main board.`
            : `No solutions found yet for ${boardSize}x${boardSize}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        {solutions.length > 0 ? (
          <ScrollArea className="h-full pr-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {solutions.map((solution) => (
                <Tooltip key={solution.id} delayDuration={100}>
                  <TooltipTrigger asChild>
                    <div
                      tabIndex={0}
                      role="button"
                      className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 rounded-md"
                      onClick={() => onSolutionClick?.(solution)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault(); // Prevent scrolling on spacebar
                          onSolutionClick?.(solution);
                        }
                      }}
                    >
                      <SolutionBoard
                        boardState={solution.board}
                        solutionNumber={solution.number}
                        boardSize={boardSize}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent 
                    className="w-auto p-1 bg-popover shadow-xl rounded-lg border border-border"
                    side="top" 
                    align="center" 
                    sideOffset={5}
                  >
                    <SolutionBoard
                      boardState={solution.board}
                      solutionNumber={solution.number}
                      boardSize={boardSize}
                    />
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Solutions will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
