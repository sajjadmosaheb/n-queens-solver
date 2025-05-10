'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface EpochDisplayProps {
  currentStepNumber: number; // If viewing solution, this could be solution number.
  totalSteps: number; // If viewing solution, this could be total solutions.
  message: string;
  status: string;
  isViewingSolution?: boolean; // Added prop
}

export function EpochDisplay({ currentStepNumber, totalSteps, message, status, isViewingSolution }: EpochDisplayProps) {
  const progressPercentage = totalSteps > 0 ? (currentStepNumber / totalSteps) * 100 : 0;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{isViewingSolution ? "Solution Details" : "Algorithm Status"}</CardTitle>
        <CardDescription>{status}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {totalSteps > 0 && !isViewingSolution && ( // Hide progress bar if viewing solution or no steps
          <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Step {currentStepNumber} of {totalSteps}</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} aria-label={`Algorithm progress: ${progressPercentage.toFixed(0)}%`} />
          </div>
        )}
         {isViewingSolution && totalSteps > 0 && ( // Special display for viewing solution
          <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
               <span>Solution {currentStepNumber} of {totalSteps} found solutions.</span>
            </div>
             {/* Optionally, a different kind of progress or no progress bar for viewing solutions */}
          </div>
        )}
        <p className="text-sm p-3 bg-muted/50 rounded-md min-h-[60px] flex items-center justify-center text-center">
          {message || "Waiting for actions..."}
        </p>
      </CardContent>
    </Card>
  );
}
