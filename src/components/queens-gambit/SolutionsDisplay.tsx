'use client';

import type { Solution } from '@/types';
import { SolutionBoard } from './SolutionBoard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SolutionsDisplayProps {
  solutions: Solution[];
  boardSize: number; // To pass to SolutionBoard
}

export function SolutionsDisplay({ solutions, boardSize }: SolutionsDisplayProps) {
  return (
    <Card className="shadow-md h-full flex flex-col">
      <CardHeader>
        <CardTitle>Solutions Found</CardTitle>
        <CardDescription>
          {solutions.length > 0 
            ? `Displaying ${solutions.length} solution(s) for ${boardSize}x${boardSize}.`
            : `No solutions found yet for ${boardSize}x${boardSize}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        {solutions.length > 0 ? (
          <ScrollArea className="h-full pr-3"> {/* Adjust height as needed */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {solutions.map((solution) => (
                <SolutionBoard
                  key={solution.id}
                  boardState={solution.board}
                  solutionNumber={solution.number}
                  boardSize={boardSize} // Pass boardSize here
                />
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
