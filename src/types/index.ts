export interface QueenPosition {
  row: number;
  col: number;
}

// BoardState: 0 = empty, 1 = queen
export type BoardState = number[][];

export type AlgorithmStepType = 
  | "INITIAL_PLACE"
  | "ATTEMPT_PLACE"
  | "PLACE_QUEEN"
  | "CONFLICT"
  | "BACKTRACK"
  | "SOLUTION_FOUND"
  | "NO_SOLUTION_POSSIBLE"
  | "FINISHED_ALL_SOLUTIONS";

export interface AlgorithmStep {
  board: BoardState;
  message: string;
  type: AlgorithmStepType;
  activeQueen?: QueenPosition; // Queen being placed, attempted, or backtracked from
  conflictingQueens?: QueenPosition[]; // Queens involved in a conflict
  solutionNumber?: number; // If type is SOLUTION_FOUND
}

export interface Solution {
  id: string;
  board: BoardState;
  number: number;
}
