'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface EpochDisplayProps {
  currentStepNumber: number;
  totalSteps: number;
  message: string;
  status: string; // e.g. "Place first queen", "Solving...", "Paused", "Finished"
}

export function EpochDisplay({ currentStepNumber, totalSteps, message, status }: EpochDisplayProps) {
  const progressPercentage = totalSteps > 0 ? (currentStepNumber / totalSteps) * 100 : 0;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Algorithm Status</CardTitle>
        <CardDescription>{status}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {totalSteps > 0 && (
          <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Step {currentStepNumber} of {totalSteps}</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} aria-label={`Algorithm progress: ${progressPercentage.toFixed(0)}%`} />
          </div>
        )}
        <p className="text-sm p-3 bg-muted/50 rounded-md min-h-[60px] flex items-center justify-center text-center">
          {message || "Waiting for actions..."}
        </p>
      </CardContent>
    </Card>
  );
}
