import type { AlgorithmVisualization } from '../types';
import { CountingInversionsVisualization } from './countingInversions';
import { KaratsubaMultiplicationVisualization } from './karatsubaMultiplication';
import { MaximumSubarrayDivideConquerVisualization } from './maximumSubarrayDivideConquer';
import { StrassensMatrixVisualization } from './strassensMatrix';

export const divideAndConquerVisualizations: Record<string, () => AlgorithmVisualization> = {
  'counting-inversions': () => new CountingInversionsVisualization(),
  'karatsuba-multiplication': () => new KaratsubaMultiplicationVisualization(),
  'maximum-subarray-divide-conquer': () => new MaximumSubarrayDivideConquerVisualization(),
  'strassens-matrix': () => new StrassensMatrixVisualization(),
};
