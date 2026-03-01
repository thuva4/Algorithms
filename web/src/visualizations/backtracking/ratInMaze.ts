import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { path: '#22c55e', trying: '#eab308', wall: '#1f2937', backtrack: '#ef4444' };

export class RatInMazeVisualization implements AlgorithmVisualization {
  name = 'Rat in a Maze';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const n = 4;
    // 1 = open, 0 = wall
    const maze = [
      1, 1, 0, 0,
      0, 1, 1, 0,
      0, 0, 1, 0,
      0, 0, 1, 1,
    ];
    const solution = new Array(n * n).fill(0);

    this.steps.push({
      data: [...maze],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Rat in ${n}x${n} maze: find path from (0,0) to (${n - 1},${n - 1}). 1=open, 0=wall`,
    });

    this.solve(maze, solution, 0, 0, n);
    return this.steps[0];
  }

  private solve(maze: number[], sol: number[], r: number, c: number, n: number): boolean {
    if (r === n - 1 && c === n - 1) {
      sol[r * n + c] = 1;
      const pathIndices = sol.map((v, i) => v === 1 ? i : -1).filter(i => i >= 0);
      this.steps.push({
        data: [...maze],
        highlights: pathIndices.map(i => ({ index: i, color: COLORS.path, label: 'P' })),
        comparisons: [],
        swaps: [],
        sorted: pathIndices,
        stepDescription: `Path found from (0,0) to (${n - 1},${n - 1})!`,
      });
      return true;
    }

    if (r < 0 || r >= n || c < 0 || c >= n || maze[r * n + c] === 0 || sol[r * n + c] === 1) {
      return false;
    }

    const idx = r * n + c;
    sol[idx] = 1;
    this.steps.push({
      data: [...maze],
      highlights: [
        { index: idx, color: COLORS.trying, label: `(${r},${c})` },
        ...sol.map((v, i) => v === 1 && i !== idx ? { index: i, color: COLORS.path } : null).filter(Boolean) as { index: number; color: string }[],
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Move to (${r},${c})`,
    });

    // Try down, right, up, left
    const dirs = [[1, 0, 'down'], [0, 1, 'right'], [-1, 0, 'up'], [0, -1, 'left']] as const;
    for (const [dr, dc] of dirs) {
      if (this.solve(maze, sol, r + dr, c + dc, n)) return true;
    }

    sol[idx] = 0;
    this.steps.push({
      data: [...maze],
      highlights: [{ index: idx, color: COLORS.backtrack, label: 'X' }],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Backtrack from (${r},${c})`,
    });
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
