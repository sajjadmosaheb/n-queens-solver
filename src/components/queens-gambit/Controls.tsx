'use client';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, StepForward, Rabbit, Turtle, Undo2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ControlsProps {
  onStart: () => void;
  onReset: () => void;
  onNextStep: () => void;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
  onResume: () => void; // New prop for resuming visualization
  isPlaying: boolean;
  isSolving: boolean;
  canStart: boolean;
  canStep: boolean;
  initialQueenPlaced: boolean;
  isFinished: boolean;
  onBoardSizeChange: (newSize: number) => void;
  currentBoardSize: number;
  disableBoardSizeChange: boolean;
  algorithmStepsLength: number; 
  isViewingSolution: boolean;
}

const BOARD_SIZES = [4, 5, 6, 7, 8, 9, 10];

export function Controls({
  onStart,
  onReset,
  onNextStep,
  onPlayPause,
  onSpeedChange,
  onResume,
  isPlaying,
  isSolving,
  canStart,
  canStep,
  initialQueenPlaced,
  isFinished,
  onBoardSizeChange,
  currentBoardSize,
  disableBoardSizeChange,
  algorithmStepsLength,
  isViewingSolution,
}: ControlsProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="board-size-select">Board Size (N)</Label>
          <Select
            value={currentBoardSize.toString()}
            onValueChange={(value) => onBoardSizeChange(parseInt(value, 10))}
            disabled={disableBoardSizeChange} 
            aria-label="Select board size"
          >
            <SelectTrigger id="board-size-select" className="w-full">
              <SelectValue placeholder="Select board size" />
            </SelectTrigger>
            <SelectContent>
              {BOARD_SIZES.map(size => (
                <SelectItem key={size} value={size.toString()}>
                  {size}x{size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           {disableBoardSizeChange && ( 
            <p className="text-xs text-muted-foreground">Reset board to change size or exit solution view.</p>
          )}
        </div>

        {isViewingSolution ? (
          <div className="space-y-4">
            <Button onClick={onResume} className="w-full" variant="default">
              <Undo2 className="mr-2 h-4 w-4" />
              Return to Visualization
            </Button>
            <Button onClick={onReset} variant="outline" className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset Board
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={onStart} disabled={!canStart || isSolving} className="w-full">
                Start Solving
              </Button>
              <Button onClick={onReset} variant="outline" className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={onPlayPause} 
                disabled={!initialQueenPlaced || isSolving || algorithmStepsLength === 0 || isFinished} 
                className="w-full"
                aria-label={isPlaying ? "Pause visualization" : "Play visualization"}
              >
                {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button 
                onClick={onNextStep} 
                disabled={!canStep || isPlaying || isSolving || isFinished} 
                className="w-full"
                aria-label="Next step in visualization"
                >
                <StepForward className="mr-2 h-4 w-4" /> Next Step
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="speed-slider">Playback Speed</Label>
              <div className="flex items-center gap-2">
                <Turtle className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <Slider
                  id="speed-slider"
                  min={100}
                  max={2000}
                  step={100}
                  defaultValue={[1600]} 
                  onValueChange={(value) => onSpeedChange(value[0])}
                  disabled={isSolving || (!initialQueenPlaced && algorithmStepsLength === 0) || isFinished}
                  className="my-1"
                  aria-label="Playback speed slider"
                />
                <Rabbit className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
