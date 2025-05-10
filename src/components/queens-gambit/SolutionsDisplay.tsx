'use client';

import type { Solution } from '@/types';
import { SolutionBoard } from './SolutionBoard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SolutionsDisplayProps {
  solutions: Solution[];
}

export function SolutionsDisplay({ solutions }: SolutionsDisplayProps) {
  return (
    <Card className="shadow-md h-full flex flex-col">
      <CardHeader>
        <CardTitle>Solutions Found</CardTitle>
        <CardDescription>
          {solutions.length > 0 
            ? `Displaying ${solutions.length} solution(s).`
            : "No solutions found yet."}
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
