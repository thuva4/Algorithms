import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

interface Point {
  x: number;
  y: number;
}

interface KDNode {
  id: string;
  point: Point;
  splitDim: number; // 0 = x, 1 = y
  left: KDNode | null;
  right: KDNode | null;
}

let nodeCounter = 0;

function cloneKD(node: KDNode | null): KDNode | null {
  if (!node) return null;
  return {
    id: node.id,
    point: { ...node.point },
    splitDim: node.splitDim,
    left: cloneKD(node.left),
    right: cloneKD(node.right),
  };
}

function kdToTreeNodeData(node: KDNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  const dimLabel = node.splitDim === 0 ? 'x' : 'y';
  return {
    id: node.id,
    value: `(${node.point.x},${node.point.y}) ${dimLabel}`,
    color: colorMap.get(node.id) ?? COLORS.default,
    left: kdToTreeNodeData(node.left, colorMap),
    right: kdToTreeNodeData(node.right, colorMap),
  };
}

/**
 * KD-Tree visualization.
 * Builds a 2D KD-Tree by recursively splitting on alternating dimensions
 * using the median, then demonstrates nearest-neighbor search.
 */
export class KDTreeVisualization implements TreeVisualizationEngine {
  name = 'KD-Tree';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(root: KDNode | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: kdToTreeNodeData(cloneKD(root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  private buildKDTree(points: Point[], depth: number, treeRoot: { ref: KDNode | null }): KDNode | null {
    if (points.length === 0) return null;

    const dim = depth % 2;
    const dimLabel = dim === 0 ? 'x' : 'y';
    points.sort((a, b) => (dim === 0 ? a.x - b.x : a.y - b.y));
    const medianIdx = Math.floor(points.length / 2);
    const medianPoint = points[medianIdx];

    const node: KDNode = {
      id: `kd-${nodeCounter++}`,
      point: medianPoint,
      splitDim: dim,
      left: null,
      right: null,
    };

    const colorMap = new Map<string, string>();
    colorMap.set(node.id, COLORS.inserted);
    if (treeRoot.ref) {
      this.addStep(treeRoot.ref, colorMap, [node.id],
        `Split on ${dimLabel}=${dim === 0 ? medianPoint.x : medianPoint.y}: median point (${medianPoint.x}, ${medianPoint.y}) at depth ${depth}`);
    }

    if (!treeRoot.ref) treeRoot.ref = node;

    node.left = this.buildKDTree(points.slice(0, medianIdx), depth + 1, treeRoot);
    node.right = this.buildKDTree(points.slice(medianIdx + 1), depth + 1, treeRoot);

    return node;
  }

  private nearestNeighbor(
    node: KDNode | null,
    target: Point,
    best: { node: KDNode | null; dist: number },
    root: KDNode
  ): void {
    if (!node) return;

    const dist = Math.sqrt(
      (node.point.x - target.x) ** 2 + (node.point.y - target.y) ** 2
    );

    const colorMap = new Map<string, string>();
    colorMap.set(node.id, COLORS.compared);
    if (best.node) colorMap.set(best.node.id, COLORS.highlighted);
    this.addStep(root, colorMap, [node.id],
      `Checking (${node.point.x},${node.point.y}), dist=${dist.toFixed(2)}, best=${best.dist.toFixed(2)}`);

    if (dist < best.dist) {
      best.dist = dist;
      best.node = node;
      const foundMap = new Map<string, string>();
      foundMap.set(node.id, COLORS.inserted);
      this.addStep(root, foundMap, [node.id],
        `New best: (${node.point.x},${node.point.y}) with dist=${dist.toFixed(2)}`);
    }

    const dim = node.splitDim;
    const diff = dim === 0 ? target.x - node.point.x : target.y - node.point.y;

    const first = diff < 0 ? node.left : node.right;
    const second = diff < 0 ? node.right : node.left;

    this.nearestNeighbor(first, target, best, root);

    if (Math.abs(diff) < best.dist) {
      this.nearestNeighbor(second, target, best, root);
    }
  }

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    nodeCounter = 0;

    // Create 2D points from pairs of values
    const points: Point[] = [];
    for (let i = 0; i < values.length - 1; i += 2) {
      points.push({ x: values[i], y: values[i + 1] });
    }
    if (values.length % 2 === 1) {
      points.push({ x: values[values.length - 1], y: 0 });
    }

    if (points.length === 0) {
      this.steps.push({ root: null, highlightedNodes: [], stepDescription: 'No values provided' });
      return this.steps[0];
    }

    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Building KD-Tree with ${points.length} points: ${points.map(p => `(${p.x},${p.y})`).join(', ')}`,
    });

    const treeRoot: { ref: KDNode | null } = { ref: null };
    const root = this.buildKDTree([...points], 0, treeRoot);

    if (root) {
      this.addStep(root, new Map(), [],
        `KD-Tree built with ${points.length} points`);

      // Demonstrate nearest neighbor search
      const queryPoint: Point = {
        x: Math.round((points[0].x + points[points.length - 1].x) / 2),
        y: Math.round((points[0].y + points[points.length - 1].y) / 2),
      };

      this.addStep(root, new Map(), [],
        `--- Nearest Neighbor Search for (${queryPoint.x}, ${queryPoint.y}) ---`);

      const best = { node: null as KDNode | null, dist: Infinity };
      this.nearestNeighbor(root, queryPoint, best, root);

      if (best.node) {
        const resultMap = new Map<string, string>();
        resultMap.set(best.node.id, COLORS.inserted);
        this.addStep(root, resultMap, [best.node.id],
          `Nearest neighbor to (${queryPoint.x},${queryPoint.y}): (${best.node.point.x},${best.node.point.y}), dist=${best.dist.toFixed(2)}`);
      }
    }

    return this.steps[0];
  }

  step(): TreeVisualizationState | null {
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
