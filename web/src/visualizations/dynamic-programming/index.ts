import type { DPVisualizationEngine } from '../types';
import { FibonacciVisualization } from './fibonacci';
import { LCSVisualization } from './lcs';
import { LISVisualization } from './lis';
import { KnapsackVisualization } from './knapsack';
import { EditDistanceVisualization } from './editDistance';
import { CoinChangeVisualization } from './coinChange';
import { MatrixChainVisualization } from './matrixChain';
import { LongestCommonSubstringVisualization } from './longestCommonSubstring';
import { BitmaskDpVisualization } from './bitmaskDp';
import { ConvexHullTrickVisualization } from './convexHullTrick';
import { DigitDpVisualization } from './digitDp';
import { DpOnTreesVisualization } from './dpOnTrees';
import { DungeonGameVisualization } from './dungeonGame';
import { DynamicProgrammingVisualization } from './dynamicProgramming';
import { EggDropVisualization } from './eggDrop';
import { KadanesVisualization } from './kadanes';
import { KnuthOptimizationVisualization } from './knuthOptimization';
import { LongestBitonicSubsequenceVisualization } from './longestBitonicSubsequence';
import { LongestPalindromicSubsequenceVisualization } from './longestPalindromicSubsequence';
import { LongestSubsetZeroSumVisualization } from './longestSubsetZeroSum';
import { OptimalBstVisualization } from './optimalBst';
import { PalindromePartitioningVisualization } from './palindromePartitioning';
import { PartitionProblemVisualization } from './partitionProblem';
import { RodCuttingVisualization } from './rodCutting';
import { SequenceAlignmentVisualization } from './sequenceAlignment';
import { SosDpVisualization } from './sosDp';
import { TravellingSalesmanVisualization } from './travellingSalesman';
import { WildcardMatchingVisualization } from './wildcardMatching';
import { WordBreakVisualization } from './wordBreak';

export const dpVisualizations: Record<string, () => DPVisualizationEngine> = {
  'fibonacci-dp': () => new FibonacciVisualization(),
  'longest-common-subsequence': () => new LCSVisualization(),
  'longest-increasing-subsequence': () => new LISVisualization(),
  'knapsack-01': () => new KnapsackVisualization(),
  'edit-distance': () => new EditDistanceVisualization(),
  'coin-change': () => new CoinChangeVisualization(),
  'matrix-chain-multiplication': () => new MatrixChainVisualization(),
  'longest-common-substring': () => new LongestCommonSubstringVisualization(),
  'bitmask-dp': () => new BitmaskDpVisualization(),
  'convex-hull-trick': () => new ConvexHullTrickVisualization(),
  'digit-dp': () => new DigitDpVisualization(),
  'dp-on-trees': () => new DpOnTreesVisualization(),
  'dungeon-game': () => new DungeonGameVisualization(),
  'dynamic-programming': () => new DynamicProgrammingVisualization(),
  'egg-drop': () => new EggDropVisualization(),
  'kadanes': () => new KadanesVisualization(),
  'knuth-optimization': () => new KnuthOptimizationVisualization(),
  'longest-bitonic-subsequence': () => new LongestBitonicSubsequenceVisualization(),
  'longest-palindromic-subsequence': () => new LongestPalindromicSubsequenceVisualization(),
  'longest-subset-zero-sum': () => new LongestSubsetZeroSumVisualization(),
  'optimal-bst': () => new OptimalBstVisualization(),
  'palindrome-partitioning': () => new PalindromePartitioningVisualization(),
  'partition-problem': () => new PartitionProblemVisualization(),
  'rod-cutting-algorithm': () => new RodCuttingVisualization(),
  'sequence-alignment': () => new SequenceAlignmentVisualization(),
  'sos-dp': () => new SosDpVisualization(),
  'travelling-salesman': () => new TravellingSalesmanVisualization(),
  'wildcard-matching': () => new WildcardMatchingVisualization(),
  'word-break': () => new WordBreakVisualization(),
};

export {
  FibonacciVisualization,
  LCSVisualization,
  LISVisualization,
  KnapsackVisualization,
  EditDistanceVisualization,
  CoinChangeVisualization,
  MatrixChainVisualization,
  LongestCommonSubstringVisualization,
  BitmaskDpVisualization,
  ConvexHullTrickVisualization,
  DigitDpVisualization,
  DpOnTreesVisualization,
  DungeonGameVisualization,
  DynamicProgrammingVisualization,
  EggDropVisualization,
  KadanesVisualization,
  KnuthOptimizationVisualization,
  LongestBitonicSubsequenceVisualization,
  LongestPalindromicSubsequenceVisualization,
  LongestSubsetZeroSumVisualization,
  OptimalBstVisualization,
  PalindromePartitioningVisualization,
  PartitionProblemVisualization,
  RodCuttingVisualization,
  SequenceAlignmentVisualization,
  SosDpVisualization,
  TravellingSalesmanVisualization,
  WildcardMatchingVisualization,
  WordBreakVisualization,
};
