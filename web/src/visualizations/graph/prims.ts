import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class PrimsVisualization implements GraphVisualizationEngine {
  name = "Prim's MST";
  visualizationType = 'graph' as const;
  private steps: GraphVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(
    nodes: { id: string; label: string }[],
    edges: { source: string; target: string; weight?: number; directed?: boolean }[],
    startNode?: string,
  ): GraphVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const positionedNodes = layoutCircle(nodes);
    const coloredEdges: GraphEdge[] = edges.map((e) => ({
      ...e,
      color: COLORS.unvisited,
    }));

    const start = startNode ?? nodes[0]?.id;
    if (!start) {
      const emptyState: GraphVisualizationState = {
        nodes: positionedNodes,
        edges: coloredEdges,
        stepDescription: 'No nodes to process',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const adj = buildAdjacency(nodes, edges);
    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();
    const inMST = new Set<string>();

    this.steps.push(snapshot(
      positionedNodes,
      coloredEdges,
      `Prim's MST: Starting from node ${start}`,
    ));

    // Add start to MST
    inMST.add(start);
    nodeColors.set(start, COLORS.visited);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Add starting node ${start} to MST`,
    ));

    let mstWeight = 0;

    while (inMST.size < nodes.length) {
      // Find minimum weight edge crossing the cut
      let minWeight = Infinity;
      let bestEdgeIdx = -1;
      let bestTarget = '';
      let bestSource = '';

      for (const nodeId of inMST) {
        const neighbors = adj.get(nodeId) ?? [];
        for (const { target, edgeIdx } of neighbors) {
          if (inMST.has(target)) continue;
          const w = edges[Number(edgeIdx)]?.weight ?? 1;
          if (w < minWeight) {
            minWeight = w;
            bestEdgeIdx = Number(edgeIdx);
            bestTarget = target;
            bestSource = nodeId;
          }
        }
      }

      if (bestEdgeIdx === -1) {
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          'No more reachable nodes. Graph may be disconnected.',
        ));
        break;
      }

      // Highlight candidate edges from MST frontier
      for (const nodeId of inMST) {
        const neighbors = adj.get(nodeId) ?? [];
        for (const { target, edgeIdx } of neighbors) {
          if (!inMST.has(target)) {
            nodeColors.set(target, COLORS.frontier);
            edgeColors.set(edgeIdx, COLORS.relaxing);
          }
        }
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Examining cut edges. Minimum: ${bestSource} - ${bestTarget} (weight: ${minWeight})`,
      ));

      // Reset non-selected cut edges
      for (const nodeId of inMST) {
        const neighbors = adj.get(nodeId) ?? [];
        for (const { target, edgeIdx } of neighbors) {
          if (!inMST.has(target)) {
            if (Number(edgeIdx) !== bestEdgeIdx) {
              edgeColors.set(edgeIdx, COLORS.unvisited);
            }
            if (target !== bestTarget) {
              nodeColors.set(target, COLORS.unvisited);
            }
          }
        }
      }

      // Add best edge and node
      inMST.add(bestTarget);
      mstWeight += minWeight;
      edgeColors.set(String(bestEdgeIdx), COLORS.inPath);
      nodeColors.set(bestTarget, COLORS.visited);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Add edge ${bestSource} - ${bestTarget} (weight: ${minWeight}) to MST. Total: ${mstWeight}`,
      ));
    }

    // Final state
    for (const n of nodes) {
      if (inMST.has(n.id)) {
        nodeColors.set(n.id, COLORS.inPath);
      }
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Prim's MST complete. Total weight: ${mstWeight}`,
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
