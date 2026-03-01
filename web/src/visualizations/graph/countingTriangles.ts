import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class CountingTrianglesVisualization implements GraphVisualizationEngine {
  name = 'Counting Triangles';
  visualizationType = 'graph' as const;
  private steps: GraphVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(
    nodes: { id: string; label: string }[],
    edges: { source: string; target: string; weight?: number; directed?: boolean }[],
    _startNode?: string,
  ): GraphVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const positionedNodes = layoutCircle(nodes);
    const coloredEdges: GraphEdge[] = edges.map((e) => ({
      ...e,
      color: COLORS.unvisited,
    }));

    if (nodes.length < 3) {
      const emptyState: GraphVisualizationState = {
        nodes: positionedNodes,
        edges: coloredEdges,
        stepDescription: 'Need at least 3 nodes to form triangles',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const adj = buildAdjacency(nodes, edges);
    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    // Build neighbor sets for O(1) lookup
    const neighborSet = new Map<string, Set<string>>();
    for (const n of nodes) {
      const nbrs = new Set<string>();
      for (const { target } of adj.get(n.id) ?? []) {
        nbrs.add(target);
      }
      neighborSet.set(n.id, nbrs);
    }

    // Build edge index lookup
    const edgeIndex = new Map<string, string>();
    edges.forEach((e, i) => {
      edgeIndex.set(`${e.source}-${e.target}`, String(i));
      if (!e.directed) edgeIndex.set(`${e.target}-${e.source}`, String(i));
    });

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      'Count triangles: for each pair of adjacent nodes (u,v), check if they share a common neighbor w.'));

    let triangleCount = 0;
    const foundTriangles = new Set<string>();
    const ids = nodes.map(n => n.id);

    for (let i = 0; i < ids.length; i++) {
      const u = ids[i];
      nodeColors.set(u, COLORS.visiting);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Check triangles involving node ${u}`,
      ));

      for (let j = i + 1; j < ids.length; j++) {
        const v = ids[j];
        if (!neighborSet.get(u)?.has(v)) continue;

        for (let k = j + 1; k < ids.length; k++) {
          const w = ids[k];
          if (!neighborSet.get(u)?.has(w) || !neighborSet.get(v)?.has(w)) continue;

          const triKey = [u, v, w].sort().join('-');
          if (foundTriangles.has(triKey)) continue;
          foundTriangles.add(triKey);
          triangleCount++;

          // Highlight the triangle
          nodeColors.set(u, COLORS.relaxing);
          nodeColors.set(v, COLORS.relaxing);
          nodeColors.set(w, COLORS.relaxing);

          const e1 = edgeIndex.get(`${u}-${v}`);
          const e2 = edgeIndex.get(`${u}-${w}`);
          const e3 = edgeIndex.get(`${v}-${w}`);
          if (e1) edgeColors.set(e1, COLORS.relaxing);
          if (e2) edgeColors.set(e2, COLORS.relaxing);
          if (e3) edgeColors.set(e3, COLORS.relaxing);

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Triangle #${triangleCount}: {${u}, ${v}, ${w}}`,
          ));

          // Reset highlighting
          nodeColors.set(v, COLORS.unvisited);
          nodeColors.set(w, COLORS.unvisited);
          if (e1) edgeColors.set(e1, COLORS.visited);
          if (e2) edgeColors.set(e2, COLORS.visited);
          if (e3) edgeColors.set(e3, COLORS.visited);
        }
      }

      nodeColors.set(u, COLORS.visited);
    }

    // Final state
    for (const id of ids) nodeColors.set(id, COLORS.visited);
    for (let i = 0; i < edges.length; i++) {
      if (!edgeColors.has(String(i))) edgeColors.set(String(i), COLORS.unvisited);
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Triangle counting complete. Total triangles found: ${triangleCount}`,
    ));

    return this.steps[0];
  }

  step(): GraphVisualizationState | null {
    this.currentStepIndex++;
    if (this.currentStepIndex >= this.steps.length) {
      this.currentStepIndex = this.steps.length;
      return null;
    }
    return this.steps[this.currentStepIndex];
  }

  reset(): void { this.currentStepIndex = -1; }
  getStepCount(): number { return this.steps.length; }
  getCurrentStep(): number { return this.currentStepIndex; }
}
