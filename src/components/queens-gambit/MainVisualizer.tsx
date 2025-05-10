'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { BoardState, QueenPosition, AlgorithmStep, Solution } from '@/types';
import { createEmptyBoard, solveNQueens } from '@/lib/queens-logic';
import { Chessboard } from './Chessboard';
import { Controls } from './Controls';
import { EpochDisplay } from './EpochDisplay';
import { SolutionsDisplay } from './SolutionsDisplay';
import { useToast } from '@/hooks/use-toast'; // Using existing useToast
import { Separator } from '@/components/ui/separator';

const N = 8;
const DEFAULT_PLAYBACK_SPEED_MS = 500; // milliseconds

export default function MainVisualizer() {
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [initialQueenPos, setInitialQueenPos] = useState<QueenPosition | null>(null);
  const [initialQueenPlaced, setInitialQueenPlaced] = useState<boolean>(false);
  
  const [algorithmSteps, setAlgorithmSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  
  const [solutions, setSolutions] = useState<Solution[]>([]);
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(DEFAULT_PLAYBACK_SPEED_MS);
  const [isSolving, setIsSolving] = useState<boolean>(false); // True when algorithm is generating steps
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const { toast } = useToast();
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetState = useCallback(() => {
    setBoard(createEmptyBoard());
    setInitialQueenPos(null);
    setInitialQueenPlaced(false);
    setAlgorithmSteps([]);
    setCurrentStepIndex(-1);
    setSolutions([]);
    setIsPlaying(false);
    if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    setIsSolving(false);
    setIsFinished(false);
    toast({ title: "Board Reset", description: "Place the first queen to begin." });
  }, [toast]);

  useEffect(() => {
    resetState();
  }, [resetState]);

  const handleSquareClick = (row: number, col: number) => {
    if (initialQueenPlaced || isSolving || algorithmSteps.length > 0) return;

    const newBoard = createEmptyBoard();
    newBoard[row][col] = 1;
    setBoard(newBoard);
    setInitialQueenPos({ row, col });
    setInitialQueenPlaced(true);
    toast({ title: "First Queen Placed", description: `Queen at ${String.fromCharCode(65 + col)}${row + 1}. Click 'Start Solving'.` });
  };

  const handleStartSolving = async () => {
    if (!initialQueenPos && !confirm("No initial queen placed. Start solving for all solutions from an empty board?")) {
        return;
    }
    if (isSolving || algorithmSteps.length > 0) return;

    setIsSolving(true);
    toast({ title: "Solving Started", description: "Generating algorithm steps..." });
    
    // Simulate async work for step generation if it were heavy
    await new Promise(resolve => setTimeout(resolve, 50)); 

    const steps = solveNQueens(initialQueenPos);
    setAlgorithmSteps(steps);
    setCurrentStepIndex(0);
    setIsSolving(false);
    setIsFinished(false);
    setSolutions([]); // Clear previous solutions
    toast({ title: "Solving Ready", description: `Found ${steps.length} steps. Use controls to visualize.` });
  };

  const displayStep = useCallback((stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= algorithmSteps.length) {
      setIsPlaying(false); // Stop play if out of bounds
      if (stepIndex >= algorithmSteps.length -1) setIsFinished(true);
      return;
    }
    
    const step = algorithmSteps[stepIndex];
    setBoard(step.board);

    if (step.type === "SOLUTION_FOUND" && step.solutionNumber) {
      const newSolution: Solution = {
        id: `sol-${step.solutionNumber}-${Date.now()}`,
        board: step.board,
        number: step.solutionNumber,
      };
      // Avoid duplicate solution numbers if algo restarts
      setSolutions(prev => {
        if (prev.find(s => s.number === newSolution.number)) return prev;
        return [...prev, newSolution].sort((a,b) => a.number - b.number);
      });
    }
    if (step.type === "FINISHED_ALL_SOLUTIONS" || step.type === "NO_SOLUTION_POSSIBLE") {
      setIsPlaying(false);
      setIsFinished(true);
    }

  }, [algorithmSteps]);

  useEffect(() => {
    if (currentStepIndex >= 0 && currentStepIndex < algorithmSteps.length) {
      displayStep(currentStepIndex);
    }
  }, [currentStepIndex, algorithmSteps, displayStep]);
  
  const handleNextStep = () => {
    if (currentStepIndex < algorithmSteps.length - 1 && !isSolving) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsPlaying(false); // Stop if at the end
    }
  };

  useEffect(() => {
    if (isPlaying) {
      playbackIntervalRef.current = setInterval(() => {
        handleNextStep();
      }, playbackSpeed);
    } else {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    }
    return () => {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    };
  }, [isPlaying, playbackSpeed, handleNextStep]); // handleNextStep needs to be stable or included

  const handlePlayPause = () => {
    if (isSolving || algorithmSteps.length === 0 || isFinished) return;
    setIsPlaying(prev => !prev);
  };

  const handleSpeedChange = (speed: number) => {
    // Slider gives 100-2000, we want to invert for delay (faster = smaller delay)
    setPlaybackSpeed(2100 - speed); 
  };

  const currentVisibleStep = algorithmSteps[currentStepIndex] || null;
  const statusMessage = isSolving ? "Generating steps..." 
                      : !initialQueenPlaced ? "Place the first queen on the board."
                      : algorithmSteps.length === 0 ? "Ready to solve. Click 'Start Solving'."
                      : isPlaying ? "Playing..."
                      : isFinished ? "Visualization finished."
                      : "Paused. Use controls to navigate.";


  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Queen's Gambit Visualizer</h1>
        <p className="text-muted-foreground">Explore the 8-Queens problem step-by-step</p>
      </header>

      <main className="flex-grow grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Chessboard
            boardState={board}
            onSquareClick={handleSquareClick}
            interactive={!initialQueenPlaced && !isSolving && algorithmSteps.length === 0}
            activeQueen={currentVisibleStep?.activeQueen}
            conflictingQueens={currentVisibleStep?.conflictingQueens}
          />
          <EpochDisplay
            currentStepNumber={currentStepIndex + 1}
            totalSteps={algorithmSteps.length}
            message={currentVisibleStep?.message || "Place the first queen or start solving."}
            status={statusMessage}
          />
        </div>

        <div className="space-y-6 md:col-span-1">
          <Controls
            onStart={handleStartSolving}
            onReset={resetState}
            onNextStep={handleNextStep}
            onPlayPause={handlePlayPause}
            onSpeedChange={handleSpeedChange}
            isPlaying={isPlaying}
            isSolving={isSolving}
            canStart={initialQueenPlaced && algorithmSteps.length === 0 && !isSolving}
            canStep={algorithmSteps.length > 0 && currentStepIndex < algorithmSteps.length -1}
            initialQueenPlaced={initialQueenPlaced}
            isFinished={isFinished}
          />
          <SolutionsDisplay solutions={solutions} />
        </div>
      </main>
      <footer className="text-center py-6 mt-8 border-t">
        <p className="text-sm text-muted-foreground">Built with Next.js and ShadCN UI.</p>
      </footer>
    </div>
  );
}
