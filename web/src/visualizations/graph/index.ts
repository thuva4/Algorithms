import type { GraphVisualizationEngine } from '../types';
import { BFSVisualization } from './bfs';
import { DFSVisualization } from './dfs';
import { DijkstrasVisualization } from './dijkstras';
import { BellmanFordVisualization } from './bellmanFord';
import { FloydWarshallVisualization } from './floydWarshall';
import { KruskalsVisualization } from './kruskals';
import { PrimsVisualization } from './prims';
import { TopologicalSortVisualization } from './topologicalSort';
import { AStarVisualization } from './aStar';
import { SCCVisualization } from './scc';
import { TwoSatVisualization } from './twoSat';
import { AStarBidirectionalVisualization } from './aStarBidirectional';
import { AllPairsShortestPathVisualization } from './allPairsShortestPath';
import { ArticulationPointsVisualization } from './articulationPoints';
import { BidirectionalBFSVisualization } from './bidirectionalBfs';
import { BipartiteCheckVisualization } from './bipartiteCheck';
import { BipartiteMatchingVisualization } from './bipartiteMatching';
import { BridgesVisualization } from './bridgesVis';
import { CentroidTreeVisualization } from './centroidTree';
import { ChromaticNumberVisualization } from './chromaticNumber';
import { ConnectedComponentLabelingVisualization } from './connectedComponentLabeling';
import { CountingTrianglesVisualization } from './countingTriangles';
import { CycleDetectionFloydVisualization } from './cycleDetectionFloyd';
import { DinicVisualization } from './dinic';
import { EdmondsKarpVisualization } from './edmondsKarp';
import { EulerPathVisualization } from './eulerPath';
import { FloodFillVisualization } from './floodFill';
import { FordFulkersonVisualization } from './fordFulkerson';
import { GraphColoringVisualization } from './graphColoring';
import { GraphCycleDetectionVisualization } from './graphCycleDetection';
import { HamiltonianPathVisualization } from './hamiltonianPath';
import { HungarianAlgorithmVisualization } from './hungarianAlgorithm';
import { JohnsonAlgorithmVisualization } from './johnsonAlgorithm';
import { KosarajusSccVisualization } from './kosarajusScc';
import { LongestPathVisualization } from './longestPath';
import { MaxFlowMinCutVisualization } from './maxFlowMinCut';
import { MaximumBipartiteMatchingVisualization } from './maximumBipartiteMatching';
import { MinimumCutStoerWagnerVisualization } from './minimumCutStoerWagner';
import { MinimumSpanningArborescenceVisualization } from './minimumSpanningArborescence';
import { MinimumSpanningTreeBoruvkaVisualization } from './minimumSpanningTreeBoruvka';
import { NetworkFlowMincostVisualization } from './networkFlowMincost';
import { PlanarityTestingVisualization } from './planarityTesting';
import { PrimsFibonacciHeapVisualization } from './primsFibonacciHeap';
import { ShortestPathDagVisualization } from './shortestPathDag';
import { SpfaVisualization } from './spfa';
import { StronglyConnectedCondensationVisualization } from './stronglyConnectedCondensation';
import { StronglyConnectedPathBasedVisualization } from './stronglyConnectedPathBased';
import { TarjansSccVisualization } from './tarjansScc';
import { TopologicalSortAllVisualization } from './topologicalSortAll';
import { TopologicalSortKahnVisualization } from './topologicalSortKahn';
import { TopologicalSortParallelVisualization } from './topologicalSortParallel';

export const graphVisualizations: Record<string, () => GraphVisualizationEngine> = {
  'breadth-first-search': () => new BFSVisualization(),
  'depth-first-search': () => new DFSVisualization(),
  'dijkstras': () => new DijkstrasVisualization(),
  'bellman-ford': () => new BellmanFordVisualization(),
  'floyd-warshall': () => new FloydWarshallVisualization(),
  'kruskals': () => new KruskalsVisualization(),
  'prims': () => new PrimsVisualization(),
  'topological-sort': () => new TopologicalSortVisualization(),
  'a-star-search': () => new AStarVisualization(),
  'strongly-connected-components': () => new SCCVisualization(),
  '2-sat': () => new TwoSatVisualization(),
  'a-star-bidirectional': () => new AStarBidirectionalVisualization(),
  'all-pairs-shortest-path': () => new AllPairsShortestPathVisualization(),
  'articulation-points': () => new ArticulationPointsVisualization(),
  'bidirectional-bfs': () => new BidirectionalBFSVisualization(),
  'bipartite-check': () => new BipartiteCheckVisualization(),
  'bipartite-matching': () => new BipartiteMatchingVisualization(),
  'bridges': () => new BridgesVisualization(),
  'centroid-tree': () => new CentroidTreeVisualization(),
  'chromatic-number': () => new ChromaticNumberVisualization(),
  'connected-component-labeling': () => new ConnectedComponentLabelingVisualization(),
  'counting-triangles': () => new CountingTrianglesVisualization(),
  'cycle-detection-floyd': () => new CycleDetectionFloydVisualization(),
  'dinic': () => new DinicVisualization(),
  'edmonds-karp': () => new EdmondsKarpVisualization(),
  'euler-path': () => new EulerPathVisualization(),
  'flood-fill': () => new FloodFillVisualization(),
  'ford-fulkerson': () => new FordFulkersonVisualization(),
  'graph-coloring': () => new GraphColoringVisualization(),
  'graph-cycle-detection': () => new GraphCycleDetectionVisualization(),
  'hamiltonian-path': () => new HamiltonianPathVisualization(),
  'hungarian-algorithm': () => new HungarianAlgorithmVisualization(),
  'johnson-algorithm': () => new JohnsonAlgorithmVisualization(),
  'kosarajus-scc': () => new KosarajusSccVisualization(),
  'longest-path': () => new LongestPathVisualization(),
  'max-flow-min-cut': () => new MaxFlowMinCutVisualization(),
  'maximum-bipartite-matching': () => new MaximumBipartiteMatchingVisualization(),
  'minimum-cut-stoer-wagner': () => new MinimumCutStoerWagnerVisualization(),
  'minimum-spanning-arborescence': () => new MinimumSpanningArborescenceVisualization(),
  'minimum-spanning-tree-boruvka': () => new MinimumSpanningTreeBoruvkaVisualization(),
  'network-flow-mincost': () => new NetworkFlowMincostVisualization(),
  'planarity-testing': () => new PlanarityTestingVisualization(),
  'prims-fibonacci-heap': () => new PrimsFibonacciHeapVisualization(),
  'shortest-path-dag': () => new ShortestPathDagVisualization(),
  'spfa': () => new SpfaVisualization(),
  'strongly-connected-condensation': () => new StronglyConnectedCondensationVisualization(),
  'strongly-connected-path-based': () => new StronglyConnectedPathBasedVisualization(),
  'tarjans-scc': () => new TarjansSccVisualization(),
  'topological-sort-all': () => new TopologicalSortAllVisualization(),
  'topological-sort-kahn': () => new TopologicalSortKahnVisualization(),
  'topological-sort-parallel': () => new TopologicalSortParallelVisualization(),
};

export {
  BFSVisualization,
  DFSVisualization,
  DijkstrasVisualization,
  BellmanFordVisualization,
  FloydWarshallVisualization,
  KruskalsVisualization,
  PrimsVisualization,
  TopologicalSortVisualization,
  AStarVisualization,
  SCCVisualization,
  TwoSatVisualization,
  AStarBidirectionalVisualization,
  AllPairsShortestPathVisualization,
  ArticulationPointsVisualization,
  BidirectionalBFSVisualization,
  BipartiteCheckVisualization,
  BipartiteMatchingVisualization,
  BridgesVisualization,
  CentroidTreeVisualization,
  ChromaticNumberVisualization,
  ConnectedComponentLabelingVisualization,
  CountingTrianglesVisualization,
  CycleDetectionFloydVisualization,
  DinicVisualization,
  EdmondsKarpVisualization,
  EulerPathVisualization,
  FloodFillVisualization,
  FordFulkersonVisualization,
  GraphColoringVisualization,
  GraphCycleDetectionVisualization,
  HamiltonianPathVisualization,
  HungarianAlgorithmVisualization,
  JohnsonAlgorithmVisualization,
  KosarajusSccVisualization,
  LongestPathVisualization,
  MaxFlowMinCutVisualization,
  MaximumBipartiteMatchingVisualization,
  MinimumCutStoerWagnerVisualization,
  MinimumSpanningArborescenceVisualization,
  MinimumSpanningTreeBoruvkaVisualization,
  NetworkFlowMincostVisualization,
  PlanarityTestingVisualization,
  PrimsFibonacciHeapVisualization,
  ShortestPathDagVisualization,
  SpfaVisualization,
  StronglyConnectedCondensationVisualization,
  StronglyConnectedPathBasedVisualization,
  TarjansSccVisualization,
  TopologicalSortAllVisualization,
  TopologicalSortKahnVisualization,
  TopologicalSortParallelVisualization,
};
