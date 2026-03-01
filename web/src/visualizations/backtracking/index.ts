import type { AlgorithmVisualization } from '../types';
import { NQueensVisualization } from './nQueens';
import { PermutationsVisualization } from './permutations';
import { SubsetSumVisualization } from './subsetSum';
import { SudokuSolverVisualization } from './sudokuSolver';
import { RatInMazeVisualization } from './ratInMaze';
import { MinimaxVisualization } from './minimax';
import { MinMaxAbPruningVisualization } from './minMaxAbPruning';

export const backtrackingVisualizations: Record<string, () => AlgorithmVisualization> = {
  'n-queens': () => new NQueensVisualization(),
  'permutations': () => new PermutationsVisualization(),
  'subset-sum': () => new SubsetSumVisualization(),
  'sudoku-solver': () => new SudokuSolverVisualization(),
  'rat-in-a-maze': () => new RatInMazeVisualization(),
  'minimax': () => new MinimaxVisualization(),
  'min-max-ab-pruning': () => new MinMaxAbPruningVisualization(),
};
