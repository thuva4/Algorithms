import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { fixed: '#94a3b8', trying: '#eab308', placed: '#22c55e', conflict: '#ef4444' };

export class SudokuSolverVisualization implements AlgorithmVisualization {
  name = 'Sudoku Solver';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(_data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    // Use a simple 4x4 Sudoku for visualization
    const n = 4;
    const board = [
      1, 0, 0, 4,
      0, 0, 1, 0,
      0, 1, 0, 0,
      4, 0, 0, 2,
    ];

    this.steps.push({
      data: [...board],
      highlights: board.map((v, i) => v > 0 ? { index: i, color: COLORS.fixed, label: `${v}` } : { index: i, color: '#e5e7eb' }).filter(h => h.label),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Solve 4x4 Sudoku using backtracking`,
    });

    this.solve(board, n);
    return this.steps[0];
  }

  private isValid(board: number[], n: number, pos: number, num: number): boolean {
    const row = Math.floor(pos / n);
    const col = pos % n;
    const boxSize = Math.floor(Math.sqrt(n));

    for (let c = 0; c < n; c++) {
      if (board[row * n + c] === num) return false;
    }
    for (let r = 0; r < n; r++) {
      if (board[r * n + col] === num) return false;
    }
    const br = Math.floor(row / boxSize) * boxSize;
    const bc = Math.floor(col / boxSize) * boxSize;
    for (let r = br; r < br + boxSize; r++) {
      for (let c = bc; c < bc + boxSize; c++) {
        if (board[r * n + c] === num) return false;
      }
    }
    return true;
  }

  private solve(board: number[], n: number): boolean {
    const empty = board.indexOf(0);
    if (empty === -1) {
      this.steps.push({
        data: [...board],
        highlights: board.map((v, i) => ({ index: i, color: COLORS.placed, label: `${v}` })),
        comparisons: [],
        swaps: [],
        sorted: board.map((_, i) => i),
        stepDescription: `Sudoku solved!`,
      });
      return true;
    }

    for (let num = 1; num <= n; num++) {
      this.steps.push({
        data: [...board],
        highlights: [{ index: empty, color: COLORS.trying, label: `${num}?` }],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Try ${num} at position (${Math.floor(empty / n)},${empty % n})`,
      });

      if (this.isValid(board, n, empty, num)) {
        board[empty] = num;
        this.steps.push({
          data: [...board],
          highlights: [{ index: empty, color: COLORS.placed, label: `${num}` }],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Place ${num} at (${Math.floor(empty / n)},${empty % n}) — valid`,
        });

        if (this.solve(board, n)) return true;

        board[empty] = 0;
        this.steps.push({
          data: [...board],
          highlights: [{ index: empty, color: COLORS.conflict, label: 'X' }],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Backtrack: remove ${num} from (${Math.floor(empty / n)},${empty % n})`,
        });
      }
    }
    return false;
  }

  step(): VisualizationState | null {
    this.currentStepIndex++;
    return this.currentStepIndex < this.steps.length ? this.steps[this.currentStepIndex] : null;
  }
  reset(): void { this.currentStepIndex = -1; }
  getStepCount(): number { return this.steps.length; }
  getCurrentStep(): number { return this.currentStepIndex; }
}
