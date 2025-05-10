'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { BoardState, QueenPosition, AlgorithmStep, Solution } from '@/types';
import { createEmptyBoard, solveNQueens } from '@/lib/queens-logic';
import { Chessboard } from './Chessboard';
import { Controls } from './Controls';
import { EpochDisplay } from './EpochDisplay';
import { SolutionsDisplay } from './SolutionsDisplay';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const DEFAULT_BOARD_SIZE = 8;
const DEFAULT_PLAYBACK_SPEED_MS = 500; // milliseconds

export default function MainVisualizer() {
  const [boardSizeN, setBoardSizeN] = useState<number>(DEFAULT_BOARD_SIZE);
  const [board, setBoard] = useState<BoardState>(createEmptyBoard(DEFAULT_BOARD_SIZE));
  const [initialQueenPos, setInitialQueenPos] = useState<QueenPosition | null>(null);
  const [initialQueenPlaced, setInitialQueenPlaced] = useState<boolean>(false);
  
  const [algorithmSteps, setAlgorithmSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  
  const [solutions, setSolutions] = useState<Solution[]>([]);
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(DEFAULT_PLAYBACK_SPEED_MS);
  const [isSolving, setIsSolving] = useState<boolean>(false); 
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const { toast } = useToast();
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetState = useCallback((newBoardSize = boardSizeN) => {
    setBoard(createEmptyBoard(newBoardSize));
    setInitialQueenPos(null);
    setInitialQueenPlaced(false);
    setAlgorithmSteps([]);
    setCurrentStepIndex(-1);
    setSolutions([]);
    setIsPlaying(false);
    if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    setIsSolving(false);
    setIsFinished(false);
    // Toast for board size change is handled in handleBoardSizeChange
    if (newBoardSize === boardSizeN) { // Only toast for normal reset
        toast({ title: "Board Reset", description: `Board reset to ${newBoardSize}x${newBoardSize}. Place the first queen to begin.` });
    }
  }, [toast, boardSizeN]); // boardSizeN dependency for the toast message accuracy on reset

  useEffect(() => {
    // Initial reset when component mounts, using default board size.
    resetState(boardSizeN);
  }, []); // Run once on mount, boardSizeN will be default

  const handleBoardSizeChange = (newSize: number) => {
    setBoardSizeN(newSize);
    resetState(newSize); // Reset state with the new size
    toast({ title: "Board Size Changed", description: `Board size set to ${newSize}x${newSize}. Place the first queen.` });
  };

  const handleSquareClick = (row: number, col: number) => {
    if (initialQueenPlaced || isSolving || algorithmSteps.length > 0) return;

    const newBoard = createEmptyBoard(boardSizeN);
    newBoard[row][col] = 1;
    setBoard(newBoard);
    setInitialQueenPos({ row, col });
    setInitialQueenPlaced(true);
    toast({ title: "First Queen Placed", description: `Queen at ${String.fromCharCode(65 + col)}${boardSizeN - row}. Click 'Start Solving'.` });
  };

  const handleStartSolving = async () => {
    if (!initialQueenPos && !confirm(`No initial queen placed on the ${boardSizeN}x${boardSizeN} board. Start solving for all solutions from an empty board?`)) {
        return;
    }
    if (isSolving || algorithmSteps.length > 0) return;

    setIsSolving(true);
    toast({ title: "Solving Started", description: `Generating algorithm steps for ${boardSizeN}-Queens...` });
    
    await new Promise(resolve => setTimeout(resolve, 50)); 

    const steps = solveNQueens(boardSizeN, initialQueenPos);
    setAlgorithmSteps(steps);
    setCurrentStepIndex(0); // Start from the first step
    setIsSolving(false);
    setIsFinished(false);
    setSolutions([]); 
    
    // Display first step immediately if steps were generated
    if (steps.length > 0) {
        displayStep(0, steps); // Pass steps directly to avoid closure issues
    } else {
        toast({ title: "Solving Ready", description: `No steps generated (this might indicate an issue or immediate no solution).`, variant: "destructive" });
    }
    toast({ title: "Solving Ready", description: `Found ${steps.length} steps for ${boardSizeN}-Queens. Use controls to visualize.` });
  };

  const displayStep = useCallback((stepIndex: number, currentSteps: AlgorithmStep[] = algorithmSteps) => {
    if (stepIndex < 0 || stepIndex >= currentSteps.length) {
      setIsPlaying(false); 
      if (stepIndex >= currentSteps.length -1 && currentSteps.length > 0) setIsFinished(true);
      return;
    }
    
    const step = currentSteps[stepIndex];
    setBoard(step.board);

    if (step.type === "SOLUTION_FOUND" && step.solutionNumber) {
      const newSolution: Solution = {
        id: `sol-${boardSizeN}-${step.solutionNumber}-${Date.now()}`,
        board: step.board,
        number: step.solutionNumber,
      };
      setSolutions(prev => {
        if (prev.find(s => s.number === newSolution.number)) return prev;
        return [...prev, newSolution].sort((a,b) => a.number - b.number);
      });
    }
    if (step.type === "FINISHED_ALL_SOLUTIONS" || step.type === "NO_SOLUTION_POSSIBLE") {
      setIsPlaying(false);
      setIsFinished(true);
    }
  }, [algorithmSteps, boardSizeN]); // Added boardSizeN for solution ID uniqueness

  useEffect(() => {
    if (currentStepIndex >= 0 && currentStepIndex < algorithmSteps.length) {
      displayStep(currentStepIndex);
    } else if (currentStepIndex === -1 && algorithmSteps.length > 0) {
      // This case might be needed if setCurrentStepIndex(0) in handleStartSolving doesn't trigger this effect in time
      // displayStep(0); // No, this can cause issues. displayStep is called directly in handleStartSolving now.
    } else if (algorithmSteps.length === 0 && currentStepIndex === 0) {
        // If steps are empty but index became 0, reset board to empty initial.
        setBoard(createEmptyBoard(boardSizeN));
    }
  }, [currentStepIndex, algorithmSteps, displayStep, boardSizeN]);
  
  const handleNextStep = useCallback(() => {
    if (currentStepIndex < algorithmSteps.length - 1 && !isSolving) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsPlaying(false); 
    }
  }, [currentStepIndex, algorithmSteps.length, isSolving]);


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
  }, [isPlaying, playbackSpeed, handleNextStep]); 

  const handlePlayPause = () => {
    if (isSolving || algorithmSteps.length === 0 || (currentStepIndex >= algorithmSteps.length - 1 && algorithmSteps.length > 0) ) return;
    setIsPlaying(prev => !prev);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(2100 - speed); 
  };

  const currentVisibleStep = algorithmSteps[currentStepIndex] || null;
  const statusMessage = isSolving ? "Generating steps..." 
                      : !initialQueenPlaced ? `Place the first queen on the ${boardSizeN}x${boardSizeN} board.`
                      : algorithmSteps.length === 0 ? "Ready to solve. Click 'Start Solving'."
                      : isPlaying ? "Playing..."
                      : isFinished ? "Visualization finished."
                      : "Paused. Use controls to navigate.";
  
  const currentQueenColChar = currentVisibleStep?.activeQueen ? String.fromCharCode(65 + currentVisibleStep.activeQueen.col) : '';
  const currentQueenRowLabel = currentVisibleStep?.activeQueen ? boardSizeN - currentVisibleStep.activeQueen.row : '';
  
  const messageWithCorrectedLabels = currentVisibleStep?.message
    .replace(/\(([A-H])(\d+)\)/g, (match, colChar, boardRow) => {
        const colIndex = colChar.charCodeAt(0) - 65;
        const rowIndex = parseInt(boardRow, 10) - 1; // Assuming message uses 1-based row index as per display
        if (colIndex >=0 && colIndex < boardSizeN && rowIndex >=0 && rowIndex < boardSizeN) {
            return `(${String.fromCharCode(65 + colIndex)}${boardSizeN - rowIndex})`;
        }
        return match; // return original if out of bounds or malformed
    })
    .replace(/initial queen placed at \(([A-H])(\d+)\)/g, (match, colChar, boardRow) => {
      const colIndex = colChar.charCodeAt(0) - 65;
      const rowIndex = parseInt(boardRow, 10) - 1; // Assuming 1-based from message
      if (colIndex >=0 && colIndex < boardSizeN && rowIndex >=0 && rowIndex < boardSizeN) {
          return `Initial queen placed at (${String.fromCharCode(65 + colIndex)}${boardSizeN - rowIndex})`;
      }
      return match;
    })
    .replace(/Conflict at \(([A-H])(\d+)\)\. Cannot place queen\. Conflicting with (.*?)\./g, (match, colChar, boardRow, conflictsStr) => {
        const colIndex = colChar.charCodeAt(0) - 65;
        const rowIndex = parseInt(boardRow, 10) - 1;
        const correctedConflicts = conflictsStr.split(', ').map((c:string) => {
            const conflictMatch = c.match(/\(([A-H])(\d+)\)/);
            if (conflictMatch) {
                const confColIndex = conflictMatch[1].charCodeAt(0) - 65;
                const confRowIndex = parseInt(conflictMatch[2], 10) -1;
                 if (confColIndex >=0 && confColIndex < boardSizeN && confRowIndex >=0 && confRowIndex < boardSizeN) {
                    return `(${String.fromCharCode(65 + confColIndex)}${boardSizeN - confRowIndex})`;
                }
            }
            return c;
        }).join(', ');

        if (colIndex >=0 && colIndex < boardSizeN && rowIndex >=0 && rowIndex < boardSizeN) {
            return `Conflict at (${String.fromCharCode(65 + colIndex)}${boardSizeN - rowIndex}). Cannot place queen. Conflicting with ${correctedConflicts}.`;
        }
        return match;
    });


  const disableBoardSizeChange = isSolving || initialQueenPlaced || algorithmSteps.length > 0;

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Queen's Gambit Visualizer</h1>
        <p className="text-muted-foreground">Explore the {boardSizeN}-Queens problem step-by-step</p>
      </header>

      <main className="flex-grow grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Chessboard
            boardState={board}
            boardSize={boardSizeN}
            onSquareClick={handleSquareClick}
            interactive={!initialQueenPlaced && !isSolving && algorithmSteps.length === 0}
            activeQueen={currentVisibleStep?.activeQueen}
            conflictingQueens={currentVisibleStep?.conflictingQueens}
          />
          <EpochDisplay
            currentStepNumber={currentStepIndex + 1} // Display 1-based step number
            totalSteps={algorithmSteps.length}
            message={messageWithCorrectedLabels || `Board is ${boardSizeN}x${boardSizeN}. Place the first queen or start solving.`}
            status={statusMessage}
          />
        </div>

        <div className="space-y-6 md:col-span-1">
          <Controls
            onStart={handleStartSolving}
            onReset={() => resetState(boardSizeN)} // Ensure reset uses current boardSizeN
            onNextStep={handleNextStep}
            onPlayPause={handlePlayPause}
            onSpeedChange={handleSpeedChange}
            isPlaying={isPlaying}
            isSolving={isSolving}
            canStart={(initialQueenPlaced || boardSizeN > 0) && algorithmSteps.length === 0 && !isSolving} // Allow start if board size selected even if no queen
            canStep={algorithmSteps.length > 0 && currentStepIndex < algorithmSteps.length -1 && !isSolving}
            initialQueenPlaced={initialQueenPlaced}
            isFinished={isFinished}
            onBoardSizeChange={handleBoardSizeChange}
            currentBoardSize={boardSizeN}
            disableBoardSizeChange={disableBoardSizeChange}
            algorithmSteps={algorithmSteps} // Pass algorithmSteps here
          />
          <SolutionsDisplay solutions={solutions} boardSize={boardSizeN} />
        </div>
      </main>
      <footer className="text-center py-6 mt-8 border-t">
        <p className="text-sm text-muted-foreground">Built with Next.js and ShadCN UI.</p>
      </footer>
    </div>
  );
}
