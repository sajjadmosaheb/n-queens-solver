import type { QueenPosition, BoardState, AlgorithmStep } from '@/types';

export function createEmptyBoard(n: number): BoardState {
  return Array(n)
    .fill(null)
    .map(() => Array(n).fill(0));
}

function cloneBoard(board: BoardState): BoardState {
  return board.map(row => [...row]);
}

function isSafe(board: BoardState, row: number, col: number, n: number): { safe: boolean; conflicts: QueenPosition[] } {
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
  for (let i = row, j = col; i < n && j >= 0; i++, j--) {
    if (board[i][j] === 1) {
      conflicts.push({ row: i, col: j });
    }
  }
  
  return { safe: conflicts.length === 0, conflicts };
}

export function solveNQueens(n: number, initialQueenPos: QueenPosition | null): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let solutionsCount = 0;
  
  const board = createEmptyBoard(n);

  if (initialQueenPos) {
    // Ensure initialQueenPos is within the bounds of the new board size 'n'
    if (initialQueenPos.row < n && initialQueenPos.col < n) {
        board[initialQueenPos.row][initialQueenPos.col] = 1;
        steps.push({
        board: cloneBoard(board),
        message: `Initial queen placed at (${String.fromCharCode(65 + initialQueenPos.col)}${initialQueenPos.row + 1}). Starting search for ${n}-Queens.`,
        type: "INITIAL_PLACE",
        activeQueen: initialQueenPos,
        });
    } else {
        // Handle case where initialQueenPos is out of bounds for the new 'n'
        // For simplicity, we'll clear it and proceed as if no initial queen was set for this 'n'
        initialQueenPos = null; 
        steps.push({
            board: cloneBoard(board), // board is empty
            message: `Starting search for ${n}-Queens with no initial queen (previous position out of bounds).`,
            type: "INITIAL_PLACE",
        });
    }
  } else {
     steps.push({
      board: cloneBoard(board),
      message: `Starting search for ${n}-Queens with no initial queen.`,
      type: "INITIAL_PLACE",
    });
  }

  function solveRec(currentBoard: BoardState, col: number): void {
    if (col >= n) {
      solutionsCount++;
      steps.push({
        board: cloneBoard(currentBoard),
        message: `Solution #${solutionsCount} found for ${n}-Queens!`,
        type: "SOLUTION_FOUND",
        solutionNumber: solutionsCount,
      });
      return;
    }

    // If an initial queen was placed, and this is its column, we must use its row.
    // Then, we move to the next column.
    if (initialQueenPos && initialQueenPos.col === col) {
      // We assume the initial queen is validly placed (or was handled above)
      // Safety check for the initial queen is implicitly handled by the user's placement
      // Or, if we want to be rigorous, it should have been checked before starting.
      // For this algorithm's flow, we assume it's a fixed point.
      solveRec(currentBoard, col + 1);
      return;
    }
    
    for (let i = 0; i < n; i++) {
      // Skip this row 'i' if the initial queen is in this row 'i' AND in a previous column.
      // This prevents trying to place another queen in the same row as the initial queen.
      if (initialQueenPos && initialQueenPos.row === i && initialQueenPos.col < col) {
        continue;
      }
      
      const activeQueenPos = { row: i, col: col };
      steps.push({
        board: cloneBoard(currentBoard),
        message: `Attempting to place queen at (${String.fromCharCode(65 + col)}${i + 1}).`,
        type: "ATTEMPT_PLACE",
        activeQueen: activeQueenPos,
      });

      const safetyCheck = isSafe(currentBoard, i, col, n);
      if (safetyCheck.safe) {
        currentBoard[i][col] = 1;
        steps.push({
          board: cloneBoard(currentBoard),
          message: `Queen placed at (${String.fromCharCode(65 + col)}${i + 1}). Moving to next column.`,
          type: "PLACE_QUEEN",
          activeQueen: activeQueenPos,
        });

        solveRec(currentBoard, col + 1);

        // Backtrack: remove queen. This condition ensures we don't remove the initial queen if it was placed by the user.
        if (!(initialQueenPos && initialQueenPos.row === i && initialQueenPos.col === col)) {
            currentBoard[i][col] = 0; 
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
  
  // Start solving from column 0. The logic inside solveRec handles the initialQueenPos.
  solveRec(board, 0);

  if (solutionsCount === 0) {
    steps.push({
      board: cloneBoard(board), 
      message: `No solutions found for ${n}-Queens with the given initial placement.`,
      type: "NO_SOLUTION_POSSIBLE",
    });
  } else {
    steps.push({
      board: cloneBoard(steps[steps.length-1].board), 
      message: `Finished. Found ${solutionsCount} solution(s) for ${n}-Queens.`,
      type: "FINISHED_ALL_SOLUTIONS",
    });
  }

  return steps;
}
