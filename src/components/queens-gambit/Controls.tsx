'use client';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, StepForward, Rabbit, Turtle } from 'lucide-react';

interface ControlsProps {
  onStart: () => void;
  onReset: () => void;
  onNextStep: () => void;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
  isPlaying: boolean;
  isSolving: boolean; // True if algorithm is running (generating steps) or playing back
  canStart: boolean; // True if initial queen is placed & not solving
  canStep: boolean; // True if there are steps to play and not currently auto-playing
  initialQueenPlaced: boolean;
  isFinished: boolean;
}

export function Controls({
  onStart,
  onReset,
  onNextStep,
  onPlayPause,
  onSpeedChange,
  isPlaying,
  isSolving,
  canStart,
  canStep,
  initialQueenPlaced,
  isFinished
}: ControlsProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={onStart} disabled={!canStart || isSolving} className="w-full">
            Start Solving
          </Button>
          <Button onClick={onReset} variant="outline" className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button onClick={onPlayPause} disabled={!initialQueenPlaced || isSolving || isFinished} className="w-full">
            {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button onClick={onNextStep} disabled={!canStep || isPlaying || isSolving || isFinished} className="w-full">
            <StepForward className="mr-2 h-4 w-4" /> Next Step
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="speed-slider">Playback Speed</Label>
          <div className="flex items-center gap-2">
            <Turtle className="h-5 w-5 text-muted-foreground" />
            <Slider
              id="speed-slider"
              min={100}
              max={2000}
              step={100}
              defaultValue={[500]}
              onValueChange={(value) => onSpeedChange(value[0])}
              disabled={isSolving}
              className="my-1"
            />
            <Rabbit className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Need to import Card, CardHeader, CardTitle, CardContent from ui
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
