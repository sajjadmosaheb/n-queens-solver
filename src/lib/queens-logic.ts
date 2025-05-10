import type { QueenPosition, BoardState, AlgorithmStep, AlgorithmStepType } from '@/types';

const N = 8;

export function createEmptyBoard(): BoardState {
  return Array(N)
    .fill(null)
    .map(() => Array(N).fill(0));
}

function cloneBoard(board: BoardState): BoardState {
  return board.map(row => [...row]);
}

function isSafe(board: BoardState, row: number, col: number): { safe: boolean; conflicts: QueenPosition[] } {
  const conflicts: QueenPosition[] = [];

  // Check this row on left side
  for (let i = 0; i < col; i++) {
    if (board[row][i] === 1) {
      conflicts.push({ row, col: i });
    }
  }

  // Check upper diagonal on left side
  for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j] === 1) {
      conflicts.push({ row: i, col: j });
    }
  }

  // Check lower diagonal on left side
  for (let i = row, j = col; i < N && j >= 0; i++, j--) {
    if (board[i][j] === 1) {
      conflicts.push({ row: i, col: j });
    }
  }
  
  return { safe: conflicts.length === 0, conflicts };
}

export function solveNQueens(initialQueenPos: QueenPosition | null): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let solutionsCount = 0;
  
  const board = createEmptyBoard();

  if (initialQueenPos) {
    board[initialQueenPos.row][initialQueenPos.col] = 1;
    steps.push({
      board: cloneBoard(board),
      message: `Initial queen placed at (${String.fromCharCode(65 + initialQueenPos.col)}${initialQueenPos.row + 1}). Starting search.`,
      type: "INITIAL_PLACE",
      activeQueen: initialQueenPos,
    });
  } else {
     steps.push({
      board: cloneBoard(board),
      message: `Starting search with no initial queen.`,
      type: "INITIAL_PLACE",
    });
  }

  function solveRec(currentBoard: BoardState, col: number): void {
    if (col >= N) {
      solutionsCount++;
      steps.push({
        board: cloneBoard(currentBoard),
        message: `Solution #${solutionsCount} found!`,
        type: "SOLUTION_FOUND",
        solutionNumber: solutionsCount,
      });
      return;
    }

    // Skip column if initial queen is there and it's not this column
    if (initialQueenPos && initialQueenPos.col === col) {
      solveRec(currentBoard, col + 1);
      return;
    }
    
    let placedInCol = false;
    for (let i = 0; i < N; i++) {
      // Skip row if initial queen is there
      if (initialQueenPos && initialQueenPos.row === i && initialQueenPos.col < col) {
         // if initial queen is in this row, but an earlier column, we can't place here
      }

      // If placing initial queen, only consider its specified row
      if (initialQueenPos && initialQueenPos.col === col && initialQueenPos.row !== i) {
        continue;
      }
      
      const activeQueenPos = { row: i, col: col };
      steps.push({
        board: cloneBoard(currentBoard),
        message: `Attempting to place queen at (${String.fromCharCode(65 + col)}${i + 1}).`,
        type: "ATTEMPT_PLACE",
        activeQueen: activeQueenPos,
      });

      const safetyCheck = isSafe(currentBoard, i, col);
      if (safetyCheck.safe) {
        currentBoard[i][col] = 1;
        placedInCol = true;
        steps.push({
          board: cloneBoard(currentBoard),
          message: `Queen placed at (${String.fromCharCode(65 + col)}${i + 1}). Moving to next column.`,
          type: "PLACE_QUEEN",
          activeQueen: activeQueenPos,
        });

        solveRec(currentBoard, col + 1);

        // Backtrack: remove queen and record step (if not initial queen's column)
         if (!(initialQueenPos && initialQueenPos.col === col)) {
            currentBoard[i][col] = 0; // Backtrack
            steps.push({
                board: cloneBoard(currentBoard),
                message: `Backtracking from (${String.fromCharCode(65 + col)}${i + 1}).`,
                type: "BACKTRACK",
                activeQueen: activeQueenPos,
            });
        }
      } else {
        steps.push({
          board: cloneBoard(currentBoard),
          message: `Conflict at (${String.fromCharCode(65 + col)}${i + 1}). Cannot place queen. Conflicting with ${safetyCheck.conflicts.map(q => `(${String.fromCharCode(65 + q.col)}${q.row + 1})`).join(', ')}.`,
          type: "CONFLICT",
          activeQueen: activeQueenPos,
          conflictingQueens: safetyCheck.conflicts,
        });
      }
    }
  }
  
  const startColumn = initialQueenPos ? 0 : 0; // Always start from col 0, logic handles initialQueen
  solveRec(board, startColumn);

  if (solutionsCount === 0) {
    steps.push({
      board: cloneBoard(board), // Show final board state (likely with only initial queen if one was placed)
      message: "No solutions found with the given initial placement.",
      type: "NO_SOLUTION_POSSIBLE",
    });
  } else {
    steps.push({
      board: cloneBoard(steps[steps.length-1].board), // Show last solution board or relevant state
      message: `Finished. Found ${solutionsCount} solution(s).`,
      type: "FINISHED_ALL_SOLUTIONS",
    });
  }

  return steps;
}
