import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  hit: '#22c55e',
  miss: '#ef4444',
  evicting: '#eab308',
  promoting: '#3b82f6',
  cached: '#8b5cf6',
  newest: '#22c55e',
  oldest: '#f97316',
};

export class LruCacheVisualization implements AlgorithmVisualization {
  name = 'LRU Cache';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const capacity = Math.max(3, Math.min(6, Math.floor(data.length / 2)));
    // Doubly-linked list order: index 0 = most recent, last = least recent
    const cache: number[] = [];
    const cacheSet = new Set<number>();

    let hits = 0;
    let misses = 0;

    const buildData = (): number[] => {
      const arr = [...cache];
      while (arr.length < data.length) arr.push(0);
      return arr;
    };

    const cacheIndices = (): number[] => Array.from({ length: cache.length }, (_, i) => i);

    this.steps.push({
      data: buildData(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `LRU Cache initialized with capacity ${capacity}. Access pattern will show cache hits, misses, promotions, and evictions.`,
    });

    // Process access pattern
    for (let i = 0; i < data.length; i++) {
      const key = data[i];
      const isHit = cacheSet.has(key);

      if (isHit) {
        hits++;
        // Find position in cache
        const pos = cache.indexOf(key);

        this.steps.push({
          data: buildData(),
          highlights: [
            { index: pos, color: COLORS.hit, label: `HIT:${key}` },
            { index: 0, color: COLORS.newest, label: 'MRU' },
            ...(cache.length > 1 ? [{ index: cache.length - 1, color: COLORS.oldest, label: 'LRU' }] : []),
          ],
          comparisons: [],
          swaps: [],
          sorted: cacheIndices(),
          stepDescription: `ACCESS ${key}: CACHE HIT at position ${pos}. Promoting to most-recently-used (front).`,
        });

        // Move to front (most recently used)
        cache.splice(pos, 1);
        cache.unshift(key);

        this.steps.push({
          data: buildData(),
          highlights: [
            { index: 0, color: COLORS.promoting, label: `${key} (MRU)` },
          ],
          comparisons: [],
          swaps: [],
          sorted: cacheIndices(),
          stepDescription: `Promoted ${key} to front. Cache order (MRU->LRU): [${cache.join(', ')}]. Hits: ${hits}, Misses: ${misses}.`,
        });
      } else {
        misses++;

        if (cache.length >= capacity) {
          // Evict LRU (last element)
          const evicted = cache[cache.length - 1];

          this.steps.push({
            data: buildData(),
            highlights: [
              { index: cache.length - 1, color: COLORS.evicting, label: `evict:${evicted}` },
            ],
            comparisons: [],
            swaps: [],
            sorted: cacheIndices(),
            stepDescription: `ACCESS ${key}: CACHE MISS. Cache full (${cache.length}/${capacity}). Evicting LRU element: ${evicted}.`,
          });

          cacheSet.delete(evicted);
          cache.pop();
        } else {
          this.steps.push({
            data: buildData(),
            highlights: [],
            comparisons: [],
            swaps: [],
            sorted: cacheIndices(),
            stepDescription: `ACCESS ${key}: CACHE MISS. Cache has space (${cache.length}/${capacity}). Adding new entry.`,
          });
        }

        // Add new element at front
        cache.unshift(key);
        cacheSet.add(key);

        this.steps.push({
          data: buildData(),
          highlights: [
            { index: 0, color: COLORS.miss, label: `new:${key}` },
            ...(cache.length > 1 ? [{ index: cache.length - 1, color: COLORS.oldest, label: 'LRU' }] : []),
          ],
          comparisons: [],
          swaps: [],
          sorted: cacheIndices(),
          stepDescription: `Inserted ${key} at front (MRU). Cache (${cache.length}/${capacity}): [${cache.join(', ')}]. Hits: ${hits}, Misses: ${misses}.`,
        });
      }
    }

    // Summary
    const hitRate = data.length > 0 ? (hits / data.length * 100).toFixed(1) : '0';
    this.steps.push({
      data: buildData(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: cacheIndices(),
      stepDescription: `LRU Cache complete. ${hits} hits, ${misses} misses. Hit rate: ${hitRate}%. All operations O(1) with doubly-linked list + hash map.`,
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
