import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class ConnectedComponentLabelingVisualization implements GraphVisualizationEngine {
  name = 'Connected Component Labeling';
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

    if (nodes.length === 0) {
      const emptyState: GraphVisualizationState = {
        nodes: positionedNodes,
        edges: coloredEdges,
        stepDescription: 'No nodes in the graph',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const adj = buildAdjacency(nodes, edges);
    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    const componentColors = ['#3b82f6', '#22c55e', '#ef4444', '#eab308', '#a855f7', '#ec4899', '#06b6d4', '#f97316'];

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      'Connected component labeling using BFS. Each connected component gets a unique label/color.'));

    const visited = new Set<string>();
    let componentId = 0;
    const components: string[][] = [];

    for (const n of nodes) {
      if (visited.has(n.id)) continue;

      const color = componentColors[componentId % componentColors.length];
      const component: string[] = [];
      const queue = [n.id];
      visited.add(n.id);

      nodeColors.set(n.id, COLORS.frontier);
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Start labeling component #${componentId + 1} from node ${n.id}`,
      ));

      while (queue.length > 0) {
        const current = queue.shift()!;
        component.push(current);
        nodeColors.set(current, COLORS.visiting);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Component #${componentId + 1}: process node ${current}`,
        ));

        for (const { target, edgeIdx } of adj.get(current) ?? []) {
          if (!visited.has(target)) {
            visited.add(target);
            queue.push(target);
            nodeColors.set(target, COLORS.frontier);
            edgeColors.set(edgeIdx, COLORS.visiting);

            this.steps.push(snapshot(
              applyNodeColors(positionedNodes, nodeColors),
              applyEdgeColors(coloredEdges, edgeColors),
              `Component #${componentId + 1}: discover ${target} via ${current}`,
            ));
          } else {
            edgeColors.set(edgeIdx, color);
          }
        }

        nodeColors.set(current, color);
      }

      // Color all edges within the component
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        if (component.includes(e.source) && component.includes(e.target)) {
          edgeColors.set(String(i), color);
        }
      }

      // Color all nodes in the component
      for (const id of component) nodeColors.set(id, color);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Component #${componentId + 1} complete: {${component.join(', ')}} (${component.length} nodes)`,
      ));

      components.push(component);
      componentId++;
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Labeling complete. ${componentId} connected component(s) found: ${components.map((c, i) => `#${i + 1}={${c.join(',')}}`).join(', ')}`,
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
