import type { AlgorithmVisualization } from '../types';
import { BloomFilterVisualization } from './bloomFilter';
import { CuckooHashingVisualization } from './cuckooHashing';
import { DisjointSparseTableVisualization } from './disjointSparseTable';
import { FibonacciHeapVisualization } from './fibonacciHeap';
import { HashTableVisualization } from './hashTable';
import { HeapOperationsVisualization } from './heapOperations';
import { InfixToPostfixVisualization } from './infixToPostfix';
import { LinkedListOperationsVisualization } from './linkedListOperations';
import { LruCacheVisualization } from './lruCache';
import { MoAlgorithmVisualization } from './moAlgorithm';
import { PersistentDataStructuresVisualization } from './persistentDataStructures';
import { PriorityQueueVisualization } from './priorityQueue';
import { QueueOperationsVisualization } from './queueOperations';
import { RopeDataStructureVisualization } from './ropeDataStructure';
import { SkipListVisualization } from './skipList';
import { SparseTableVisualization } from './sparseTable';
import { SqrtDecompositionVisualization } from './sqrtDecomposition';
import { StackOperationsVisualization } from './stackOperations';
import { UnionFindVisualization } from './unionFind';
import { VanEmdeBoasVisualization } from './vanEmdeBoas';

export const dataStructuresVisualizations: Record<string, () => AlgorithmVisualization> = {
  'bloom-filter': () => new BloomFilterVisualization(),
  'cuckoo-hashing': () => new CuckooHashingVisualization(),
  'disjoint-sparse-table': () => new DisjointSparseTableVisualization(),
  'fibonacci-heap': () => new FibonacciHeapVisualization(),
  'hash-table': () => new HashTableVisualization(),
  'heap-operations': () => new HeapOperationsVisualization(),
  'infix-to-postfix': () => new InfixToPostfixVisualization(),
  'linked-list-operations': () => new LinkedListOperationsVisualization(),
  'lru-cache': () => new LruCacheVisualization(),
  'mo-algorithm': () => new MoAlgorithmVisualization(),
  'persistent-data-structures': () => new PersistentDataStructuresVisualization(),
  'priority-queue': () => new PriorityQueueVisualization(),
  'queue-operations': () => new QueueOperationsVisualization(),
  'rope-data-structure': () => new RopeDataStructureVisualization(),
  'skip-list': () => new SkipListVisualization(),
  'sparse-table': () => new SparseTableVisualization(),
  'sqrt-decomposition': () => new SqrtDecompositionVisualization(),
  'stack-operations': () => new StackOperationsVisualization(),
  'union-find': () => new UnionFindVisualization(),
  'van-emde-boas-tree': () => new VanEmdeBoasVisualization(),
};
