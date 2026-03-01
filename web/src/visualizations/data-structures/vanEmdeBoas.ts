import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  inserting: '#22c55e',
  querying: '#3b82f6',
  splitting: '#eab308',
  found: '#8b5cf6',
  cluster: '#f97316',
  summary: '#ef4444',
  minimum: '#22c55e',
  maximum: '#ef4444',
};

export class VanEmdeBoasVisualization implements AlgorithmVisualization {
  name = 'Van Emde Boas Tree';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Universe size: smallest power of 2 >= max element + 1, capped at 16 for visualization
    const universeSize = 16; // 2^4, gives sqrt = 4
    const sqrtU = 4; // sqrt(16)

    // Bit array to represent the vEB tree contents
    const present = new Array(universeSize).fill(0);
    let treeMin: number | null = null;
    let treeMax: number | null = null;
    // Clusters: divide universe into sqrt(U) clusters of size sqrt(U)
    const clusters = Array.from({ length: sqrtU }, () => new Array(sqrtU).fill(0));
    const summary = new Array(sqrtU).fill(0); // which clusters are non-empty

    const high = (x: number) => Math.floor(x / sqrtU);
    const low = (x: number) => x % sqrtU;
    const indexFn = (h: number, l: number) => h * sqrtU + l;

    const buildData = (): number[] => {
      const arr = [...present];
      while (arr.length < data.length) arr.push(0);
      return arr.slice(0, data.length);
    };

    const getInsertedIndices = (): number[] => {
      const indices: number[] = [];
      for (let i = 0; i < universeSize; i++) {
        if (present[i]) indices.push(i);
      }
      return indices.filter(i => i < data.length);
    };

    this.steps.push({
      data: buildData(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Van Emde Boas tree: universe size U = ${universeSize}, sqrt(U) = ${sqrtU}. ${sqrtU} clusters of size ${sqrtU}. Supports insert, delete, successor, predecessor in O(log log U).`,
    });

    // Show cluster structure
    const clusterHighlights: { index: number; color: string; label?: string }[] = [];
    for (let c = 0; c < sqrtU; c++) {
      for (let j = 0; j < sqrtU; j++) {
        const idx = indexFn(c, j);
        if (idx < data.length) {
          clusterHighlights.push({
            index: idx,
            color: c % 2 === 0 ? COLORS.cluster : COLORS.splitting,
            label: `C${c}`,
          });
        }
      }
    }

    this.steps.push({
      data: buildData(),
      highlights: clusterHighlights,
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Universe split into ${sqrtU} clusters: C0=[0-${sqrtU - 1}], C1=[${sqrtU}-${2 * sqrtU - 1}], C2=[${2 * sqrtU}-${3 * sqrtU - 1}], C3=[${3 * sqrtU}-${4 * sqrtU - 1}]. Recursive structure.`,
    });

    // INSERT operations
    const insertValues = [...new Set(data.map(v => Math.abs(v) % universeSize))].slice(0, 8);

    for (const val of insertValues) {
      const c = high(val);
      const l = low(val);

      this.steps.push({
        data: buildData(),
        highlights: val < data.length ? [
          { index: val, color: COLORS.inserting, label: `ins:${val}` },
        ] : [],
        comparisons: [],
        swaps: [],
        sorted: getInsertedIndices(),
        stepDescription: `INSERT ${val}: high(${val}) = ${c} (cluster), low(${val}) = ${l} (position within cluster). Recursing into cluster ${c}.`,
      });

      // Check min/max
      if (treeMin === null) {
        treeMin = val;
        treeMax = val;

        this.steps.push({
          data: buildData(),
          highlights: val < data.length ? [
            { index: val, color: COLORS.minimum, label: `min=max` },
          ] : [],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `First element. Set min = max = ${val}. vEB stores min/max separately (not in clusters). O(1).`,
        });
      } else {
        let insertVal = val;
        if (insertVal < treeMin) {
          // Swap with min (new min stored separately)
          const oldMin = treeMin;
          treeMin = insertVal;
          insertVal = oldMin;

          this.steps.push({
            data: buildData(),
            highlights: [],
            comparisons: [],
            swaps: [],
            sorted: getInsertedIndices(),
            stepDescription: `${val} < current min (${oldMin}). Swap: new min = ${val}, insert old min ${oldMin} into clusters.`,
          });
        }

        if (insertVal > treeMax!) {
          treeMax = insertVal;
        }

        // Insert into cluster
        const ic = high(insertVal);
        const il = low(insertVal);

        if (clusters[ic][il] === 0) {
          clusters[ic][il] = 1;
          present[insertVal] = 1;

          // Update summary
          const wasEmpty = summary[ic] === 0;
          summary[ic] = 1;

          this.steps.push({
            data: buildData(),
            highlights: insertVal < data.length ? [
              { index: insertVal, color: COLORS.inserting, label: `C${ic}[${il}]` },
            ] : [],
            comparisons: [],
            swaps: [],
            sorted: getInsertedIndices(),
            stepDescription: `Inserted ${insertVal} into cluster ${ic}, position ${il}.${wasEmpty ? ` Cluster ${ic} was empty -- updated summary.` : ''} Min=${treeMin}, Max=${treeMax}.`,
          });
        } else {
          present[insertVal] = 1;
          this.steps.push({
            data: buildData(),
            highlights: [],
            comparisons: [],
            swaps: [],
            sorted: getInsertedIndices(),
            stepDescription: `${insertVal} already exists in cluster ${ic}. No change needed.`,
          });
        }
      }
    }

    // SUCCESSOR queries
    const queryValues = insertValues.slice(0, 3);
    for (const val of queryValues) {
      this.steps.push({
        data: buildData(),
        highlights: val < data.length ? [
          { index: val, color: COLORS.querying, label: `succ(${val})` },
        ] : [],
        comparisons: [],
        swaps: [],
        sorted: getInsertedIndices(),
        stepDescription: `SUCCESSOR(${val}): find smallest element > ${val}. First check within cluster ${high(val)}.`,
      });

      // Find successor
      const c = high(val);
      const l = low(val);
      let successor: number | null = null;

      // Check within same cluster
      for (let j = l + 1; j < sqrtU; j++) {
        if (clusters[c][j] === 1) {
          successor = indexFn(c, j);
          break;
        }
      }

      if (successor !== null) {
        this.steps.push({
          data: buildData(),
          highlights: successor < data.length ? [
            { index: val < data.length ? val : 0, color: COLORS.querying, label: `${val}` },
            { index: successor, color: COLORS.found, label: `succ=${successor}` },
          ] : [],
          comparisons: [],
          swaps: [],
          sorted: getInsertedIndices(),
          stepDescription: `Found successor ${successor} in same cluster ${c}. O(log log U) time -- only checked within cluster.`,
        });
      } else {
        // Check summary for next non-empty cluster
        let nextCluster = -1;
        for (let nc = c + 1; nc < sqrtU; nc++) {
          if (summary[nc] === 1) {
            nextCluster = nc;
            break;
          }
        }

        if (nextCluster >= 0) {
          // Find min of next cluster
          for (let j = 0; j < sqrtU; j++) {
            if (clusters[nextCluster][j] === 1) {
              successor = indexFn(nextCluster, j);
              break;
            }
          }

          this.steps.push({
            data: buildData(),
            highlights: [
              ...(val < data.length ? [{ index: val, color: COLORS.querying, label: `${val}` }] : []),
              ...(successor !== null && successor < data.length ? [{ index: successor, color: COLORS.found, label: `succ=${successor}` }] : []),
            ],
            comparisons: [],
            swaps: [],
            sorted: getInsertedIndices(),
            stepDescription: `No successor in cluster ${c}. Used summary to find next non-empty cluster ${nextCluster}. Successor = ${successor}. O(log log U).`,
          });
        } else {
          this.steps.push({
            data: buildData(),
            highlights: val < data.length ? [
              { index: val, color: COLORS.querying, label: `no succ` },
            ] : [],
            comparisons: [],
            swaps: [],
            sorted: getInsertedIndices(),
            stepDescription: `No successor for ${val}. It is the maximum element or no larger elements exist.`,
          });
        }
      }
    }

    // Final summary
    const elements: number[] = [];
    if (treeMin !== null) elements.push(treeMin);
    for (let i = 0; i < universeSize; i++) {
      if (present[i] && i !== treeMin) elements.push(i);
    }
    elements.sort((a, b) => a - b);

    this.steps.push({
      data: buildData(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: getInsertedIndices(),
      stepDescription: `Van Emde Boas tree complete. Elements: {${elements.join(', ')}}. Min=${treeMin}, Max=${treeMax}. All operations O(log log U) where U=${universeSize}.`,
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
