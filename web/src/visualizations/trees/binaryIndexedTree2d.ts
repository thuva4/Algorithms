import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

function lowbit(x: number): number {
  return x & (-x);
}

/**
 * 2D Binary Indexed Tree (2D Fenwick Tree) visualization.
 * Visualized as a tree where the root represents the full 2D grid,
 * and children represent row-level BIT nodes with column-level detail.
 */
export class BinaryIndexedTree2DVisualization implements TreeVisualizationEngine {
  name = '2D Binary Indexed Tree';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private buildTreeView(bit2d: number[][], rows: number, cols: number, colorMap: Map<string, string>): TreeNodeData {
    const rowChildren: TreeNodeData[] = [];
    for (let r = 1; r <= rows; r++) {
      const colChildren: TreeNodeData[] = [];
      for (let c = 1; c <= cols; c++) {
        colChildren.push({
          id: `bit-${r}-${c}`,
          value: bit2d[r][c],
          color: colorMap.get(`bit-${r}-${c}`) ?? COLORS.default,
        });
      }
      rowChildren.push({
        id: `row-${r}`,
        value: `R${r}`,
        color: colorMap.get(`row-${r}`) ?? COLORS.default,
        children: colChildren,
      });
    }
    return {
      id: 'root',
      value: '2D BIT',
      color: colorMap.get('root') ?? COLORS.default,
      children: rowChildren,
    };
  }

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Arrange values into a small 2D grid
    const n = values.length;
    const size = Math.max(2, Math.ceil(Math.sqrt(n)));
    const rows = Math.min(size, 4);
    const cols = Math.min(size, 4);

    const grid: number[][] = [];
    for (let r = 0; r < rows; r++) {
      grid.push([]);
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        grid[r].push(idx < n ? values[idx] : 0);
      }
    }

    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Building 2D BIT for ${rows}x${cols} grid from values: [${values.slice(0, rows * cols).join(', ')}]`,
    });

    // Initialize 2D BIT
    const bit2d: number[][] = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));

    // Build 2D BIT by updating each cell
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = grid[r][c];
        if (val === 0) continue;

        const updatedNodes: string[] = [];
        let ri = r + 1;
        while (ri <= rows) {
          let ci = c + 1;
          while (ci <= cols) {
            bit2d[ri][ci] += val;
            updatedNodes.push(`bit-${ri}-${ci}`);
            ci += lowbit(ci);
          }
          ri += lowbit(ri);
        }

        const colorMap = new Map<string, string>();
        for (const nodeId of updatedNodes) {
          colorMap.set(nodeId, COLORS.inserted);
        }
        const tree = this.buildTreeView(bit2d, rows, cols, colorMap);
        this.steps.push({
          root: tree,
          highlightedNodes: updatedNodes,
          stepDescription: `Updated grid[${r}][${c}] = ${val}: affected BIT cells [${updatedNodes.join(', ')}]`,
        });
      }
    }

    // Show completed tree
    const finalTree = this.buildTreeView(bit2d, rows, cols, new Map());
    this.steps.push({
      root: finalTree,
      highlightedNodes: [],
      stepDescription: `2D BIT construction complete for ${rows}x${cols} grid`,
    });

    // Demonstrate a prefix sum query
    const qr = Math.min(2, rows);
    const qc = Math.min(2, cols);
    this.steps.push({
      root: finalTree,
      highlightedNodes: [],
      stepDescription: `--- Prefix Sum Query: sum of subgrid [1..${qr}][1..${qc}] ---`,
    });

    let sum = 0;
    const queryNodes: string[] = [];
    let ri = qr;
    while (ri > 0) {
      let ci = qc;
      while (ci > 0) {
        sum += bit2d[ri][ci];
        queryNodes.push(`bit-${ri}-${ci}`);
        ci -= lowbit(ci);
      }
      ri -= lowbit(ri);
    }

    const queryColorMap = new Map<string, string>();
    for (const nodeId of queryNodes) {
      queryColorMap.set(nodeId, COLORS.highlighted);
    }
    const queryTree = this.buildTreeView(bit2d, rows, cols, queryColorMap);
    this.steps.push({
      root: queryTree,
      highlightedNodes: queryNodes,
      stepDescription: `Query result: sum of subgrid [1..${qr}][1..${qc}] = ${sum}`,
    });

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
