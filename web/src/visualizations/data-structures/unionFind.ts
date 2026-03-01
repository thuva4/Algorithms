import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  finding: '#eab308',
  compressing: '#3b82f6',
  unioning: '#22c55e',
  root: '#ef4444',
  sameSet: '#8b5cf6',
  diffSet: '#f97316',
};

export class UnionFindVisualization implements AlgorithmVisualization {
  name = 'Union-Find';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = Math.min(data.length, 12);
    const parent: number[] = Array.from({ length: n }, (_, i) => i);
    const rank: number[] = new Array(n).fill(0);

    const find = (x: number): number => {
      const path: number[] = [x];
      while (parent[x] !== x) {
        x = parent[x];
        path.push(x);
      }
      return x;
    };

    const findWithCompression = (x: number): { root: number; path: number[] } => {
      const path: number[] = [x];
      let current = x;
      while (parent[current] !== current) {
        current = parent[current];
        path.push(current);
      }
      const root = current;
      // Path compression: make all nodes on path point directly to root
      for (const node of path) {
        if (node !== root) {
          parent[node] = root;
        }
      }
      return { root, path };
    };

    const getComponentColors = (): { index: number; color: string; label?: string }[] => {
      const roots = new Map<number, string>();
      const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899', '#84cc16', '#f43f5e', '#6366f1', '#14b8a6'];
      let colorIdx = 0;

      const highlights: { index: number; color: string; label?: string }[] = [];
      for (let i = 0; i < n; i++) {
        const root = find(i);
        if (!roots.has(root)) {
          roots.set(root, colors[colorIdx % colors.length]);
          colorIdx++;
        }
        highlights.push({
          index: i,
          color: roots.get(root)!,
          label: `p:${parent[i]}`,
        });
      }
      return highlights;
    };

    this.steps.push({
      data: parent.slice(0, n),
      highlights: Array.from({ length: n }, (_, i) => ({
        index: i,
        color: COLORS.root,
        label: `{${i}}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Union-Find initialized: ${n} elements, each in its own set. parent[i] = i for all. rank[i] = 0 for all.`,
    });

    // Perform union operations using data values to determine pairs
    const unions: [number, number][] = [];
    for (let i = 0; i < Math.min(n - 1, Math.floor(n * 0.7)); i++) {
      const a = i;
      const b = (Math.abs(data[i % data.length]) % n);
      if (a !== b) {
        unions.push([a, b]);
      }
    }

    for (const [a, b] of unions) {
      // FIND operations
      const rootA = find(a);
      const rootB = find(b);

      this.steps.push({
        data: [...parent.slice(0, n), ...new Array(Math.max(0, data.length - n)).fill(0)].slice(0, data.length),
        highlights: [
          { index: a, color: COLORS.finding, label: `find(${a})` },
          { index: b, color: COLORS.finding, label: `find(${b})` },
        ],
        comparisons: [[a, b]],
        swaps: [],
        sorted: [],
        stepDescription: `UNION(${a}, ${b}): first find roots. find(${a}) = ${rootA}, find(${b}) = ${rootB}.`,
      });

      if (rootA === rootB) {
        this.steps.push({
          data: [...parent.slice(0, n), ...new Array(Math.max(0, data.length - n)).fill(0)].slice(0, data.length),
          highlights: [
            { index: a, color: COLORS.sameSet, label: `same set` },
            { index: b, color: COLORS.sameSet, label: `same set` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `${a} and ${b} already in same set (root=${rootA}). No union needed.`,
        });
        continue;
      }

      // Union by rank
      this.steps.push({
        data: [...parent.slice(0, n), ...new Array(Math.max(0, data.length - n)).fill(0)].slice(0, data.length),
        highlights: [
          { index: rootA, color: COLORS.root, label: `rank=${rank[rootA]}` },
          { index: rootB, color: COLORS.root, label: `rank=${rank[rootB]}` },
        ],
        comparisons: [[rootA, rootB]],
        swaps: [],
        sorted: [],
        stepDescription: `Union by rank: root ${rootA} (rank ${rank[rootA]}) vs root ${rootB} (rank ${rank[rootB]}). Attach smaller rank tree under larger.`,
      });

      if (rank[rootA] < rank[rootB]) {
        parent[rootA] = rootB;

        this.steps.push({
          data: [...parent.slice(0, n), ...new Array(Math.max(0, data.length - n)).fill(0)].slice(0, data.length),
          highlights: [
            { index: rootA, color: COLORS.unioning, label: `->${rootB}` },
            { index: rootB, color: COLORS.root, label: `root` },
          ],
          comparisons: [],
          swaps: [[rootA, rootB]],
          sorted: [],
          stepDescription: `rank[${rootA}] < rank[${rootB}]: ${rootA} now child of ${rootB}. parent[${rootA}] = ${rootB}.`,
        });
      } else if (rank[rootA] > rank[rootB]) {
        parent[rootB] = rootA;

        this.steps.push({
          data: [...parent.slice(0, n), ...new Array(Math.max(0, data.length - n)).fill(0)].slice(0, data.length),
          highlights: [
            { index: rootB, color: COLORS.unioning, label: `->${rootA}` },
            { index: rootA, color: COLORS.root, label: `root` },
          ],
          comparisons: [],
          swaps: [[rootB, rootA]],
          sorted: [],
          stepDescription: `rank[${rootA}] > rank[${rootB}]: ${rootB} now child of ${rootA}. parent[${rootB}] = ${rootA}.`,
        });
      } else {
        parent[rootB] = rootA;
        rank[rootA]++;

        this.steps.push({
          data: [...parent.slice(0, n), ...new Array(Math.max(0, data.length - n)).fill(0)].slice(0, data.length),
          highlights: [
            { index: rootB, color: COLORS.unioning, label: `->${rootA}` },
            { index: rootA, color: COLORS.root, label: `rank++` },
          ],
          comparisons: [],
          swaps: [[rootB, rootA]],
          sorted: [],
          stepDescription: `Equal ranks: ${rootB} under ${rootA}. rank[${rootA}] incremented to ${rank[rootA]}.`,
        });
      }

      // Show component state
      this.steps.push({
        data: [...parent.slice(0, n), ...new Array(Math.max(0, data.length - n)).fill(0)].slice(0, data.length),
        highlights: getComponentColors(),
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `After union(${a}, ${b}): parent = [${parent.slice(0, n).join(', ')}]. Components colored by root.`,
      });
    }

    // PATH COMPRESSION demonstration
    if (n >= 3) {
      // Find a node with depth > 1
      let deepNode = -1;
      for (let i = 0; i < n; i++) {
        if (parent[i] !== i && parent[parent[i]] !== parent[i]) {
          deepNode = i;
          break;
        }
      }

      if (deepNode === -1) {
        // Create a chain for demo
        for (let i = 0; i < n; i++) {
          if (parent[i] !== i) {
            deepNode = i;
            break;
          }
        }
      }

      if (deepNode >= 0) {
        this.steps.push({
          data: [...parent.slice(0, n), ...new Array(Math.max(0, data.length - n)).fill(0)].slice(0, data.length),
          highlights: [
            { index: deepNode, color: COLORS.compressing, label: `compress` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `PATH COMPRESSION: find(${deepNode}). Before compression: following parent chain to root.`,
        });

        const { root, path } = findWithCompression(deepNode);

        const compressHighlights: { index: number; color: string; label?: string }[] = path.map(node => ({
          index: node,
          color: node === root ? COLORS.root : COLORS.compressing,
          label: node === root ? `root` : `->${root}`,
        }));

        this.steps.push({
          data: [...parent.slice(0, n), ...new Array(Math.max(0, data.length - n)).fill(0)].slice(0, data.length),
          highlights: compressHighlights,
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Path compression: nodes [${path.join(' -> ')}] all now point directly to root ${root}. Future finds will be O(1). Amortized: O(alpha(n)).`,
        });
      }
    }

    // Count final components
    const componentRoots = new Set<number>();
    for (let i = 0; i < n; i++) {
      componentRoots.add(find(i));
    }

    this.steps.push({
      data: [...parent.slice(0, n), ...new Array(Math.max(0, data.length - n)).fill(0)].slice(0, data.length),
      highlights: getComponentColors(),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      stepDescription: `Union-Find complete. ${componentRoots.size} disjoint sets. parent: [${parent.slice(0, n).join(', ')}]. rank: [${rank.slice(0, n).join(', ')}]. Amortized O(alpha(n)) per operation with path compression and union by rank.`,
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
