import type { AlgorithmVisualization } from '../types';
import { BubbleSortVisualization } from './bubbleSort';
import { InsertionSortVisualization } from './insertionSort';
import { SelectionSortVisualization } from './selectionSort';
import { MergeSortVisualization } from './mergeSort';
import { QuickSortVisualization } from './quickSort';
import { HeapSortVisualization } from './heapSort';
import { CountingSortVisualization } from './countingSort';
import { RadixSortVisualization } from './radixSort';
import { ShellSortVisualization } from './shellSort';
import { BitonicSortVisualization } from './bitonicSort';
import { BogoSortVisualization } from './bogoSort';
import { BucketSortVisualization } from './bucketSort';
import { CocktailShakerSortVisualization } from './cocktailShakerSort';
import { CocktailSortVisualization } from './cocktailSort';
import { CombSortVisualization } from './combSort';
import { CycleSortVisualization } from './cycleSort';
import { GnomeSortVisualization } from './gnomeSort';
import { PancakeSortVisualization } from './pancakeSort';
import { PartialSortVisualization } from './partialSort';
import { PigeonholeSortVisualization } from './pigeonholeSort';
import { PostmanSortVisualization } from './postmanSort';
import { StrandSortVisualization } from './strandSort';
import { TimSortVisualization } from './timSort';
import { TreeSortVisualization } from './treeSort';

export const sortingVisualizations: Record<string, () => AlgorithmVisualization> = {
  'bubble-sort': () => new BubbleSortVisualization(),
  'insertion-sort': () => new InsertionSortVisualization(),
  'selection-sort': () => new SelectionSortVisualization(),
  'merge-sort': () => new MergeSortVisualization(),
  'quick-sort': () => new QuickSortVisualization(),
  'heap-sort': () => new HeapSortVisualization(),
  'counting-sort': () => new CountingSortVisualization(),
  'radix-sort': () => new RadixSortVisualization(),
  'shell-sort': () => new ShellSortVisualization(),
  'bitonic-sort': () => new BitonicSortVisualization(),
  'bogo-sort': () => new BogoSortVisualization(),
  'bucket-sort': () => new BucketSortVisualization(),
  'cocktail-shaker-sort': () => new CocktailShakerSortVisualization(),
  'cocktail-sort': () => new CocktailSortVisualization(),
  'comb-sort': () => new CombSortVisualization(),
  'cycle-sort': () => new CycleSortVisualization(),
  'gnome-sort': () => new GnomeSortVisualization(),
  'pancake-sort': () => new PancakeSortVisualization(),
  'partial-sort': () => new PartialSortVisualization(),
  'pigeonhole-sort': () => new PigeonholeSortVisualization(),
  'postman-sort': () => new PostmanSortVisualization(),
  'strand-sort': () => new StrandSortVisualization(),
  'tim-sort': () => new TimSortVisualization(),
  'tree-sort': () => new TreeSortVisualization(),
};

export {
  BubbleSortVisualization,
  InsertionSortVisualization,
  SelectionSortVisualization,
  MergeSortVisualization,
  QuickSortVisualization,
  HeapSortVisualization,
  CountingSortVisualization,
  RadixSortVisualization,
  ShellSortVisualization,
  BitonicSortVisualization,
  BogoSortVisualization,
  BucketSortVisualization,
  CocktailShakerSortVisualization,
  CocktailSortVisualization,
  CombSortVisualization,
  CycleSortVisualization,
  GnomeSortVisualization,
  PancakeSortVisualization,
  PartialSortVisualization,
  PigeonholeSortVisualization,
  PostmanSortVisualization,
  StrandSortVisualization,
  TimSortVisualization,
  TreeSortVisualization,
};
