import type { TreeVisualizationEngine } from '../types';
import { BinarySearchTreeVisualization } from './binarySearchTree';
import { TreeTraversalsVisualization } from './treeTraversals';
import { AVLTreeVisualization } from './avlTree';
import { SegmentTreeVisualization } from './segmentTree';
import { FenwickTreeVisualization } from './fenwickTree';
import { BTreeVisualization } from './bTree';
import { BinaryIndexedTree2DVisualization } from './binaryIndexedTree2d';
import { BinaryTreeVisualization } from './binaryTree';
import { CentroidDecompositionVisualization } from './centroidDecomposition';
import { HeavyLightDecompositionVisualization } from './heavyLightDecomposition';
import { IntervalTreeVisualization } from './intervalTree';
import { KDTreeVisualization } from './kdTree';
import { LowestCommonAncestorVisualization } from './lowestCommonAncestor';
import { MergeSortTreeVisualization } from './mergeSortTree';
import { PersistentSegmentTreeVisualization } from './persistentSegmentTree';
import { PruferCodeVisualization } from './pruferCode';
import { RangeTreeVisualization } from './rangeTree';
import { RedBlackTreeVisualization } from './redBlackTree';
import { SegmentTreeLazyVisualization } from './segmentTreeLazy';
import { SplayTreeVisualization } from './splayTree';
import { TarjansOfflineLCAVisualization } from './tarjansOfflineLca';
import { TreapVisualization } from './treap';
import { TreeDiameterVisualization } from './treeDiameter';
import { TrieVisualization } from './trie';

export const treeVisualizations: Record<string, () => TreeVisualizationEngine> = {
  'binary-search-tree': () => new BinarySearchTreeVisualization(),
  'tree-traversals': () => new TreeTraversalsVisualization(),
  'avl-tree': () => new AVLTreeVisualization(),
  'segment-tree': () => new SegmentTreeVisualization(),
  'fenwick-tree': () => new FenwickTreeVisualization(),
  'b-tree': () => new BTreeVisualization(),
  'binary-indexed-tree-2d': () => new BinaryIndexedTree2DVisualization(),
  'binary-tree': () => new BinaryTreeVisualization(),
  'centroid-decomposition': () => new CentroidDecompositionVisualization(),
  'heavy-light-decomposition': () => new HeavyLightDecompositionVisualization(),
  'interval-tree': () => new IntervalTreeVisualization(),
  'kd-tree': () => new KDTreeVisualization(),
  'lowest-common-ancestor': () => new LowestCommonAncestorVisualization(),
  'merge-sort-tree': () => new MergeSortTreeVisualization(),
  'persistent-segment-tree': () => new PersistentSegmentTreeVisualization(),
  'prufer-code': () => new PruferCodeVisualization(),
  'range-tree': () => new RangeTreeVisualization(),
  'red-black-tree': () => new RedBlackTreeVisualization(),
  'segment-tree-lazy': () => new SegmentTreeLazyVisualization(),
  'splay-tree': () => new SplayTreeVisualization(),
  'tarjans-offline-lca': () => new TarjansOfflineLCAVisualization(),
  'treap': () => new TreapVisualization(),
  'tree-diameter': () => new TreeDiameterVisualization(),
  'trie': () => new TrieVisualization(),
};

export {
  BinarySearchTreeVisualization,
  TreeTraversalsVisualization,
  AVLTreeVisualization,
  SegmentTreeVisualization,
  FenwickTreeVisualization,
  BTreeVisualization,
  BinaryIndexedTree2DVisualization,
  BinaryTreeVisualization,
  CentroidDecompositionVisualization,
  HeavyLightDecompositionVisualization,
  IntervalTreeVisualization,
  KDTreeVisualization,
  LowestCommonAncestorVisualization,
  MergeSortTreeVisualization,
  PersistentSegmentTreeVisualization,
  PruferCodeVisualization,
  RangeTreeVisualization,
  RedBlackTreeVisualization,
  SegmentTreeLazyVisualization,
  SplayTreeVisualization,
  TarjansOfflineLCAVisualization,
  TreapVisualization,
  TreeDiameterVisualization,
  TrieVisualization,
};
