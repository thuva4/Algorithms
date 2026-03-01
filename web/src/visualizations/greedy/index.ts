import type { AlgorithmVisualization } from '../types';
import { ActivitySelectionVisualization } from './activitySelection';
import { ElevatorAlgorithmVisualization } from './elevatorAlgorithm';
import { FractionalKnapsackVisualization } from './fractionalKnapsack';
import { HuffmanCodingVisualization } from './huffmanCoding';
import { IntervalSchedulingVisualization } from './intervalScheduling';
import { JobSchedulingVisualization } from './jobScheduling';
import { LeakyBucketVisualization } from './leakyBucket';

export const greedyVisualizations: Record<string, () => AlgorithmVisualization> = {
  'activity-selection': () => new ActivitySelectionVisualization(),
  'elevator-algorithm': () => new ElevatorAlgorithmVisualization(),
  'fractional-knapsack': () => new FractionalKnapsackVisualization(),
  'huffman-coding': () => new HuffmanCodingVisualization(),
  'interval-scheduling': () => new IntervalSchedulingVisualization(),
  'job-scheduling': () => new JobSchedulingVisualization(),
  'leaky-bucket': () => new LeakyBucketVisualization(),
};
