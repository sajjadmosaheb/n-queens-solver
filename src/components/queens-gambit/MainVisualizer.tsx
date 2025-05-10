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
  const [viewingSolution, setViewingSolution] = useState<Solution | null>(null); // New state for viewing a selected solution
  
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
    setViewingSolution(null); // Reset viewing solution state
    setIsPlaying(false);
    if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    setIsSolving(false);
    setIsFinished(false);
    if (newBoardSize === boardSizeN) {
        toast({ title: "Board Reset", description: `Board reset to ${newBoardSize}x${newBoardSize}. Place the first queen to begin.` });
    }
  }, [toast, boardSizeN]);

  useEffect(() => {
    resetState(boardSizeN);
  }, []);

  const handleBoardSizeChange = (newSize: number) => {
    setBoardSizeN(newSize);
    resetState(newSize);
    toast({ title: "Board Size Changed", description: `Board size set to ${newSize}x${newSize}. Place the first queen.` });
  };

  const handleSquareClick = (row: number, col: number) => {
    if (initialQueenPlaced || isSolving || algorithmSteps.length > 0 || viewingSolution) return;

    const newBoard = createEmptyBoard(boardSizeN);
    newBoard[row][col] = 1;
    setBoard(newBoard);
    setInitialQueenPos({ row, col });
    setInitialQueenPlaced(true);
    toast({ title: "First Queen Placed", description: `Queen at ${String.fromCharCode(65 + col)}${boardSizeN - row}. Click 'Start Solving'.` });
  };

  const handleStartSolving = async () => {
    if (viewingSolution) setViewingSolution(null); // Clear viewing solution if starting new solve
    if (!initialQueenPos && !confirm(`No initial queen placed on the ${boardSizeN}x${boardSizeN} board. Start solving for all solutions from an empty board?`)) {
        return;
    }
    if (isSolving || (algorithmSteps.length > 0 && !isFinished)) return;


    setIsSolving(true);
    setIsFinished(false);
    setSolutions([]); 
    setAlgorithmSteps([]);
    setCurrentStepIndex(-1);
    toast({ title: "Solving Started", description: `Generating algorithm steps for ${boardSizeN}-Queens...` });
    
    await new Promise(resolve => setTimeout(resolve, 50)); 

    const steps = solveNQueens(boardSizeN, initialQueenPos);
    setAlgorithmSteps(steps);
    setCurrentStepIndex(0); 
    setIsSolving(false);
    
    if (steps.length > 0) {
        displayStep(0, steps);
    } else {
        toast({ title: "Solving Ready", description: `No steps generated.`, variant: "destructive" });
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
  }, [algorithmSteps, boardSizeN]);

  useEffect(() => {
    if (viewingSolution) return; // Don't display steps if viewing a solution
    if (currentStepIndex >= 0 && currentStepIndex < algorithmSteps.length) {
      displayStep(currentStepIndex);
    } else if (algorithmSteps.length === 0 && currentStepIndex === 0) {
        setBoard(createEmptyBoard(boardSizeN));
    }
  }, [currentStepIndex, algorithmSteps, displayStep, boardSizeN, viewingSolution]);
  
  const handleNextStep = useCallback(() => {
    if (viewingSolution) return;
    if (currentStepIndex < algorithmSteps.length - 1 && !isSolving) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsPlaying(false); 
    }
  }, [currentStepIndex, algorithmSteps.length, isSolving, viewingSolution]);


  useEffect(() => {
    if (isPlaying && !viewingSolution) {
      playbackIntervalRef.current = setInterval(() => {
        handleNextStep();
      }, playbackSpeed);
    } else {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    }
    return () => {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    };
  }, [isPlaying, playbackSpeed, handleNextStep, viewingSolution]); 

  const handlePlayPause = () => {
    if (viewingSolution || isSolving || algorithmSteps.length === 0 || (currentStepIndex >= algorithmSteps.length - 1 && algorithmSteps.length > 0) ) return;
    setIsPlaying(prev => !prev);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(2100 - speed); 
  };

  const handleSolutionSelect = (solution: Solution) => {
    setViewingSolution(solution);
    setBoard(solution.board);
    setIsPlaying(false);
    if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    // Keep algorithmSteps and solutions, but indicate we are not stepping through algorithm
    setCurrentStepIndex(-1); // Indicate not in algorithm playback
    setIsFinished(true); // Treat as a "finished" state for algorithm controls
    // initialQueenPlaced remains true as the board is effectively set
    toast({ title: "Viewing Solution", description: `Displaying solution #${solution.number} on the main board.` });
  };

  const currentVisibleStep = algorithmSteps[currentStepIndex] || null;
  
  let statusMessage: string;
  if (viewingSolution) {
    statusMessage = `Viewing solution #${viewingSolution.number}. Click 'Reset' to clear.`;
  } else if (isSolving) {
    statusMessage = "Generating steps...";
  } else if (!initialQueenPlaced) {
    statusMessage = `Place the first queen on the ${boardSizeN}x${boardSizeN} board.`;
  } else if (algorithmSteps.length === 0) {
    statusMessage = "Ready to solve. Click 'Start Solving'.";
  } else if (isPlaying) {
    statusMessage = "Playing...";
  } else if (isFinished) {
    statusMessage = "Visualization finished.";
  } else {
    statusMessage = "Paused. Use controls to navigate.";
  }
  
  const messageWithCorrectedLabels = viewingSolution 
    ? `Displaying solution #${viewingSolution.number}.`
    : (currentVisibleStep?.message
        .replace(/\(([A-H])(\d+)\)/g, (match, colChar, boardRow) => {
            const colIndex = colChar.charCodeAt(0) - 65;
            const rowIndex = parseInt(boardRow, 10) - 1;
            if (colIndex >=0 && colIndex < boardSizeN && rowIndex >=0 && rowIndex < boardSizeN) {
                return `(${String.fromCharCode(65 + colIndex)}${boardSizeN - rowIndex})`;
            }
            return match;
        })
        .replace(/initial queen placed at \(([A-H])(\d+)\)/g, (match, colChar, boardRow) => {
          const colIndex = colChar.charCodeAt(0) - 65;
          const rowIndex = parseInt(boardRow, 10) - 1;
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
        })) || `Board is ${boardSizeN}x${boardSizeN}. Place the first queen or start solving.`;


  const disableBoardSizeChange = isSolving || initialQueenPlaced || algorithmSteps.length > 0 || !!viewingSolution;

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
            interactive={!initialQueenPlaced && !isSolving && algorithmSteps.length === 0 && !viewingSolution}
            activeQueen={viewingSolution ? undefined : currentVisibleStep?.activeQueen}
            conflictingQueens={viewingSolution ? undefined : currentVisibleStep?.conflictingQueens}
          />
          <EpochDisplay
            currentStepNumber={viewingSolution ? solutions.find(s => s.id === viewingSolution.id)?.number ?? 0 : currentStepIndex + 1}
            totalSteps={viewingSolution ? solutions.length : algorithmSteps.length}
            message={messageWithCorrectedLabels}
            status={statusMessage}
            isViewingSolution={!!viewingSolution}
          />
        </div>

        <div className="space-y-6 md:col-span-1">
          <Controls
            onStart={handleStartSolving}
            onReset={() => resetState(boardSizeN)}
            onNextStep={handleNextStep}
            onPlayPause={handlePlayPause}
            onSpeedChange={handleSpeedChange}
            isPlaying={isPlaying}
            isSolving={isSolving}
            canStart={(initialQueenPlaced || boardSizeN > 0) && (algorithmSteps.length === 0 || isFinished) && !isSolving && !viewingSolution}
            canStep={!viewingSolution && algorithmSteps.length > 0 && currentStepIndex < algorithmSteps.length -1 && !isSolving && !isFinished}
            initialQueenPlaced={initialQueenPlaced}
            isFinished={isFinished || !!viewingSolution} // Treat viewing solution as a "finished" state for controls
            onBoardSizeChange={handleBoardSizeChange}
            currentBoardSize={boardSizeN}
            disableBoardSizeChange={disableBoardSizeChange}
            algorithmSteps={algorithmSteps}
            isViewingSolution={!!viewingSolution}
          />
          <SolutionsDisplay 
            solutions={solutions} 
            boardSize={boardSizeN} 
            onSolutionClick={handleSolutionSelect}
          />
        </div>
      </main>
      <footer className="text-center py-6 mt-8 border-t">
        <p className="text-sm text-muted-foreground">Built with Next.js and ShadCN UI.</p>
      </footer>
    </div>
  );
}
