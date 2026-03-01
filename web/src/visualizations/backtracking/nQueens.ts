import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { queen: '#22c55e', trying: '#eab308', conflict: '#ef4444', empty: '#94a3b8' };

export class NQueensVisualization implements AlgorithmVisualization {
  name = 'N-Queens';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const n = Math.min(Math.max(data.length, 4), 8);
    const board = new Array(n).fill(-1); // board[row] = col

    this.steps.push({
      data: new Array(n * n).fill(0),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `N-Queens problem: place ${n} queens on ${n}x${n} board. Array shows board state (row-major).`,
    });

    this.solve(board, 0, n);
    return this.steps[0];
  }

  private boardToData(board: number[], n: number): number[] {
    const data = new Array(n * n).fill(0);
    for (let r = 0; r < n; r++) {
      if (board[r] >= 0) data[r * n + board[r]] = n - r;
    }
    return data;
  }

  private isSafe(board: number[], row: number, col: number): boolean {
    for (let r = 0; r < row; r++) {
      if (board[r] === col || Math.abs(board[r] - col) === Math.abs(r - row)) return false;
    }
    return true;
  }

  private solve(board: number[], row: number, n: number): boolean {
    if (row === n) {
      this.steps.push({
        data: this.boardToData(board, n),
        highlights: board.map((c, r) => ({ index: r * n + c, color: COLORS.queen, label: 'Q' })),
        comparisons: [],
        swaps: [],
        sorted: board.map((c, r) => r * n + c),
        stepDescription: `Solution found! All ${n} queens placed safely.`,
      });
      return true;
    }

    for (let col = 0; col < n; col++) {
      const idx = row * n + col;
      this.steps.push({
        data: this.boardToData(board, n),
        highlights: [
          { index: idx, color: COLORS.trying, label: '?' },
          ...Array.from({ length: row }, (_, r) => ({
            index: r * n + board[r],
            color: COLORS.queen,
            label: 'Q',
          })),
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Try queen at row ${row}, col ${col}`,
      });

      if (this.isSafe(board, row, col)) {
        board[row] = col;
        if (this.solve(board, row + 1, n)) return true;
        board[row] = -1;
        this.steps.push({
          data: this.boardToData(board, n),
          highlights: [{ index: idx, color: COLORS.conflict, label: 'X' }],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Backtrack from row ${row}, col ${col}`,
        });
      } else {
        this.steps.push({
          data: this.boardToData(board, n),
          highlights: [{ index: idx, color: COLORS.conflict, label: 'X' }],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Conflict at row ${row}, col ${col} — skip`,
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
