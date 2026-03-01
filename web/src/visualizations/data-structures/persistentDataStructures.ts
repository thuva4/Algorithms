import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  current: '#eab308',
  newPath: '#22c55e',
  oldPath: '#3b82f6',
  copying: '#ef4444',
  version: '#8b5cf6',
  shared: '#6b7280',
};

export class PersistentDataStructuresVisualization implements AlgorithmVisualization {
  name = 'Persistent Data Structures';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = Math.min(data.length, 8);
    const values = data.slice(0, n);

    // Simulate a persistent array using path copying on a balanced binary tree
    // Tree stored as array: index i has children at 2i+1, 2i+2
    const treeSize = 15; // 4 levels
    const leaves = 8;

    // Build initial tree (version 0)
    const versions: number[][] = [];
    const v0 = new Array(treeSize).fill(0);
    // Fill leaves (indices 7-14) with initial values
    for (let i = 0; i < leaves && i < n; i++) {
      v0[7 + i] = values[i] || 0;
    }
    // Internal nodes store min of children
    for (let i = 6; i >= 0; i--) {
      const left = 2 * i + 1 < treeSize ? v0[2 * i + 1] : Infinity;
      const right = 2 * i + 2 < treeSize ? v0[2 * i + 2] : Infinity;
      v0[i] = Math.min(left, right);
    }
    versions.push([...v0]);

    const buildData = (tree: number[]): number[] => {
      const result = [...tree];
      while (result.length < data.length) result.push(0);
      return result.slice(0, Math.max(data.length, treeSize));
    };

    this.steps.push({
      data: buildData(v0),
      highlights: Array.from({ length: Math.min(n, leaves) }, (_, i) => ({
        index: 7 + i,
        color: COLORS.current,
        label: `${v0[7 + i]}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Version 0: persistent segment tree built. ${Math.min(n, leaves)} leaf values: [${values.slice(0, leaves).join(', ')}]. Internal nodes store range minimums.`,
    });

    // Show tree structure
    const treeHighlights: { index: number; color: string; label?: string }[] = [];
    for (let i = 0; i < treeSize; i++) {
      treeHighlights.push({
        index: i,
        color: i >= 7 ? COLORS.current : COLORS.oldPath,
        label: `${v0[i]}`,
      });
    }
    this.steps.push({
      data: buildData(v0),
      highlights: treeHighlights.slice(0, buildData(v0).length),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Version 0 tree: root=${v0[0]}. Internal nodes: min of children. Tree structure enables O(log n) path copying.`,
    });

    // Perform updates creating new versions via path copying
    const updates = Math.min(4, n);
    for (let u = 0; u < updates; u++) {
      const prevTree = [...versions[versions.length - 1]];
      const newTree = [...prevTree]; // Start as copy (will share unchanged nodes)
      const leafIdx = u % leaves;
      const treeLeafIdx = 7 + leafIdx;
      const oldVal = newTree[treeLeafIdx];
      const newVal = oldVal + 10 + u * 5;

      // Show which leaf we're updating
      this.steps.push({
        data: buildData(prevTree),
        highlights: [
          { index: treeLeafIdx, color: COLORS.copying, label: `update` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Creating Version ${versions.length}: update leaf ${leafIdx} from ${oldVal} to ${newVal}. Path copying will duplicate nodes on root-to-leaf path.`,
      });

      // Update leaf
      newTree[treeLeafIdx] = newVal;

      // Path copy: update ancestors
      const pathNodes: number[] = [treeLeafIdx];
      let current = treeLeafIdx;
      while (current > 0) {
        current = Math.floor((current - 1) / 2);
        const leftChild = 2 * current + 1 < treeSize ? newTree[2 * current + 1] : Infinity;
        const rightChild = 2 * current + 2 < treeSize ? newTree[2 * current + 2] : Infinity;
        newTree[current] = Math.min(leftChild, rightChild);
        pathNodes.push(current);
      }

      // Show path being copied
      const pathHighlights: { index: number; color: string; label?: string }[] = [];
      const sharedHighlights: { index: number; color: string; label?: string }[] = [];
      for (let i = 0; i < treeSize && i < buildData(newTree).length; i++) {
        if (pathNodes.includes(i)) {
          pathHighlights.push({ index: i, color: COLORS.newPath, label: `new:${newTree[i]}` });
        } else if (newTree[i] !== 0) {
          sharedHighlights.push({ index: i, color: COLORS.shared, label: `shared` });
        }
      }

      this.steps.push({
        data: buildData(newTree),
        highlights: [...pathHighlights, ...sharedHighlights],
        comparisons: [],
        swaps: [],
        sorted: pathNodes.filter(i => i < buildData(newTree).length),
        stepDescription: `Version ${versions.length}: path copied (${pathNodes.length} nodes: [${pathNodes.reverse().join(' -> ')}]). ${treeSize - pathNodes.length} nodes shared with previous version. O(log n) space per update.`,
      });

      versions.push([...newTree]);

      // Show that old version is still accessible
      this.steps.push({
        data: buildData(prevTree),
        highlights: [
          { index: 0, color: COLORS.version, label: `v${versions.length - 2}` },
          { index: treeLeafIdx, color: COLORS.oldPath, label: `${prevTree[treeLeafIdx]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Version ${versions.length - 2} still intact! Leaf ${leafIdx} = ${prevTree[treeLeafIdx]} in old version, ${newVal} in new version. Persistence via structural sharing.`,
      });
    }

    // Query across versions
    for (let v = 0; v < Math.min(versions.length, 3); v++) {
      const tree = versions[v];
      this.steps.push({
        data: buildData(tree),
        highlights: [
          { index: 0, color: COLORS.version, label: `v${v}:min=${tree[0]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Query version ${v}: global minimum = ${tree[0]}. Each version accessible in O(1), queries in O(log n).`,
      });
    }

    const latestTree = versions[versions.length - 1];
    this.steps.push({
      data: buildData(latestTree),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: Math.min(treeSize, buildData(latestTree).length) }, (_, i) => i),
      stepDescription: `Persistent data structure complete. ${versions.length} versions maintained. O(log n) time and space per update. All versions queryable.`,
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
