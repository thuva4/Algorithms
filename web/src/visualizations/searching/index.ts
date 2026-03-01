import type { AlgorithmVisualization } from '../types';
import { LinearSearchVisualization } from './linearSearch';
import { BinarySearchVisualization } from './binarySearch';
import { JumpSearchVisualization } from './jumpSearch';
import { ExponentialSearchVisualization } from './exponentialSearch';
import { InterpolationSearchVisualization } from './interpolationSearch';
import { FibonacciSearchVisualization } from './fibonacciSearch';
import { TernarySearchVisualization } from './ternarySearch';
import { BestFirstSearchVisualization } from './bestFirstSearch';
import { ModifiedBinarySearchVisualization } from './modifiedBinarySearch';
import { QuickSelectVisualization } from './quickSelect';

export const searchingVisualizations: Record<string, () => AlgorithmVisualization> = {
  'linear-search': () => new LinearSearchVisualization(),
  'binary-search': () => new BinarySearchVisualization(),
  'jump-search': () => new JumpSearchVisualization(),
  'exponential-search': () => new ExponentialSearchVisualization(),
  'interpolation-search': () => new InterpolationSearchVisualization(),
  'fibonacci-search': () => new FibonacciSearchVisualization(),
  'ternary-search': () => new TernarySearchVisualization(),
  'best-first-search': () => new BestFirstSearchVisualization(),
  'modified-binary-search': () => new ModifiedBinarySearchVisualization(),
  'quick-select': () => new QuickSelectVisualization(),
};
