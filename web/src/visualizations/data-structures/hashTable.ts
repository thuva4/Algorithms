import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  hashing: '#eab308',
  inserting: '#22c55e',
  collision: '#ef4444',
  chaining: '#3b82f6',
  searching: '#8b5cf6',
  found: '#22c55e',
  bucket: '#f97316',
};

export class HashTableVisualization implements AlgorithmVisualization {
  name = 'Hash Table';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const tableSize = Math.max(7, Math.ceil(data.length * 0.7));
    // Each bucket is a chain (array of numbers)
    const buckets: number[][] = [];
    for (let i = 0; i < tableSize; i++) buckets.push([]);

    const hashFn = (val: number): number => ((val % tableSize) + tableSize) % tableSize;

    // Flatten buckets to visualization data:
    // data array = [bucket0_count, bucket1_count, ...] showing load per bucket
    const buildData = (): number[] => {
      return buckets.map(b => b.length);
    };

    const getNonEmpty = (): number[] => {
      const result: number[] = [];
      for (let i = 0; i < tableSize; i++) {
        if (buckets[i].length > 0) result.push(i);
      }
      return result;
    };

    this.steps.push({
      data: buildData(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Hash table initialized with ${tableSize} buckets. Using chaining for collision resolution. h(k) = k mod ${tableSize}.`,
    });

    // Insert elements
    let totalCollisions = 0;
    for (const item of data) {
      const bucket = hashFn(item);
      const isCollision = buckets[bucket].length > 0;

      // Show hash computation
      this.steps.push({
        data: buildData(),
        highlights: [
          { index: bucket, color: COLORS.hashing, label: `h(${item})=${bucket}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: getNonEmpty(),
        stepDescription: `INSERT ${item}: h(${item}) = ${item} mod ${tableSize} = ${bucket}.${isCollision ? ` Collision! Bucket ${bucket} has ${buckets[bucket].length} element(s): [${buckets[bucket].join(', ')}].` : ' Bucket is empty.'}`,
      });

      if (isCollision) {
        totalCollisions++;
      }

      buckets[bucket].push(item);

      this.steps.push({
        data: buildData(),
        highlights: [
          { index: bucket, color: isCollision ? COLORS.collision : COLORS.inserting, label: `[${buckets[bucket].join(',')}]` },
        ],
        comparisons: [],
        swaps: [],
        sorted: getNonEmpty(),
        stepDescription: `Inserted ${item} into bucket ${bucket}. Chain: [${buckets[bucket].join(' -> ')}]. Bucket depth: ${buckets[bucket].length}.${isCollision ? ' Chaining used.' : ''}`,
      });
    }

    // Show load factor analysis
    const loadFactor = data.length / tableSize;
    const maxChain = Math.max(...buckets.map(b => b.length));
    const emptyBuckets = buckets.filter(b => b.length === 0).length;

    this.steps.push({
      data: buildData(),
      highlights: buckets.map((b, i) => ({
        index: i,
        color: b.length === maxChain ? COLORS.collision : b.length > 0 ? COLORS.bucket : COLORS.hashing,
        label: `${b.length}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: getNonEmpty(),
      stepDescription: `Load analysis: load factor = ${loadFactor.toFixed(2)}, max chain = ${maxChain}, empty buckets = ${emptyBuckets}, collisions = ${totalCollisions}.`,
    });

    // Search for some elements
    const searchItems = [data[0], data[Math.floor(data.length / 2)], data[data.length - 1] + 100];
    for (const item of searchItems) {
      const bucket = hashFn(item);
      const chain = buckets[bucket];

      this.steps.push({
        data: buildData(),
        highlights: [
          { index: bucket, color: COLORS.searching, label: `search ${item}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: getNonEmpty(),
        stepDescription: `SEARCH ${item}: h(${item}) = ${bucket}. Checking bucket ${bucket} chain: [${chain.join(' -> ')}].`,
      });

      const found = chain.includes(item);
      let comparisons = 0;
      for (const val of chain) {
        comparisons++;
        if (val === item) break;
      }

      this.steps.push({
        data: buildData(),
        highlights: [
          { index: bucket, color: found ? COLORS.found : COLORS.collision, label: found ? `found!` : `not found` },
        ],
        comparisons: [],
        swaps: [],
        sorted: getNonEmpty(),
        stepDescription: found
          ? `FOUND ${item} in bucket ${bucket} after ${comparisons} comparison(s).`
          : `${item} NOT FOUND in bucket ${bucket}. Searched entire chain of ${chain.length} element(s).`,
      });
    }

    this.steps.push({
      data: buildData(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: getNonEmpty(),
      stepDescription: `Hash table operations complete. Average O(1) with good hash function. Worst case O(n) if all elements collide.`,
    });

    return this.steps[0];
  }

  step(): VisualizationState | null {
    this.currentStepIndex++;
    if (this.currentStepIndex >= this.steps.length) {
      this.currentStepIndex = this.steps.length;
      return null;
    }
    return this.steps[this.currentStepIndex];
  }

  reset(): void {
    this.currentStepIndex = -1;
  }

  getStepCount(): number {
    return this.steps.length;
  }

  getCurrentStep(): number {
    return this.currentStepIndex;
  }
}
