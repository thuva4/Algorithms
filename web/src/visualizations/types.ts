// ── Visualization Type Discriminator ──────────────────────────────────
export type VisualizationType = 'sorting' | 'graph' | 'tree' | 'dp' | 'string';

// ── Sorting Visualization State ──────────────────────────────────────
export interface VisualizationState {
  data: number[];
  highlights: { index: number; color: string; label?: string }[];
  comparisons: [number, number][];
  swaps: [number, number][];
  sorted: number[];
  stepDescription: string;
}

// ── Graph Visualization State ────────────────────────────────────────
export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  row?: number;
  col?: number;
  blocked?: boolean;
  cost?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
  color: string;
  directed?: boolean;
}

export interface GraphVisualizationStats {
  visitedCount: number;
  frontierCount: number;
  pathCount: number;
}

export interface GraphVisualizationState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stepDescription: string;
  startNodeId?: string;
  targetNodeId?: string;
  stats?: GraphVisualizationStats;
}

// ── Tree Visualization State ─────────────────────────────────────────
export interface TreeNodeData {
  id: string;
  value: number | string;
  color: string;
  left?: TreeNodeData | null;
  right?: TreeNodeData | null;
  children?: TreeNodeData[];
}

export interface TreeVisualizationState {
  root: TreeNodeData | null;
  highlightedNodes: string[];
  stepDescription: string;
}

// ── DP Visualization State ───────────────────────────────────────────
export interface DPCell {
  value: number | string;
  color: string;
}

export interface DPVisualizationState {
  table: DPCell[][];
  rowLabels: string[];
  colLabels: string[];
  currentCell: [number, number] | null;
  arrows: { from: [number, number]; to: [number, number] }[];
  stepDescription: string;
}

// ── String Visualization State ───────────────────────────────────────
export interface CharCell {
  char: string;
  color: string;
}

export interface StringVisualizationState {
  text: CharCell[];
  pattern: CharCell[];
  patternOffset: number;
  auxiliaryData?: { label: string; values: (number | string)[] }[];
  stepDescription: string;
}

// ── Union of All Visualization States ────────────────────────────────
export type AnyVisualizationState =
  | VisualizationState
  | GraphVisualizationState
  | TreeVisualizationState
  | DPVisualizationState
  | StringVisualizationState;

// ── Visualization Engine Interfaces ──────────────────────────────────

/** Original sorting-specific interface (backward compatible) */
export interface AlgorithmVisualization {
  name: string;
  visualizationType?: VisualizationType;
  initialize(data: number[]): VisualizationState;
  step(): VisualizationState | null;
  reset(): void;
  getStepCount(): number;
  getCurrentStep(): number;
}

/** Graph visualization engine */
export interface GraphVisualizationEngine {
  name: string;
  visualizationType: 'graph';
  initialize(nodes: { id: string; label: string }[], edges: { source: string; target: string; weight?: number; directed?: boolean }[], startNode?: string, endNode?: string): GraphVisualizationState;
  step(): GraphVisualizationState | null;
  reset(): void;
  getStepCount(): number;
  getCurrentStep(): number;
}

/** Tree visualization engine */
export interface TreeVisualizationEngine {
  name: string;
  visualizationType: 'tree';
  initialize(values: number[]): TreeVisualizationState;
  step(): TreeVisualizationState | null;
  reset(): void;
  getStepCount(): number;
  getCurrentStep(): number;
}

/** DP visualization engine */
export interface DPVisualizationEngine {
  name: string;
  visualizationType: 'dp';
  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState;
  step(): DPVisualizationState | null;
  reset(): void;
  getStepCount(): number;
  getCurrentStep(): number;
}

/** String visualization engine */
export interface StringVisualizationEngine {
  name: string;
  visualizationType: 'string';
  initialize(text: string, pattern: string): StringVisualizationState;
  step(): StringVisualizationState | null;
  reset(): void;
  getStepCount(): number;
  getCurrentStep(): number;
}

/** Union of all visualization engines for the registry */
export type AnyVisualizationEngine =
  | AlgorithmVisualization
  | GraphVisualizationEngine
  | TreeVisualizationEngine
  | DPVisualizationEngine
  | StringVisualizationEngine;
