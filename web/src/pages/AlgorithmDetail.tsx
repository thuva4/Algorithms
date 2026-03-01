import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { AlgorithmDetailData } from '../types';
import type { AnyVisualizationState, AnyVisualizationEngine, VisualizationState, GraphVisualizationState, TreeVisualizationState, DPVisualizationState, StringVisualizationState, TreeNodeData, VisualizationType } from '../visualizations/types';
import { getVisualization } from '../visualizations/registry';
import Visualizer from '../components/Visualizer/Visualizer';
import GraphVisualizer from '../components/Visualizer/GraphVisualizer';
import TreeVisualizer from '../components/Visualizer/TreeVisualizer';
import DPVisualizer from '../components/Visualizer/DPVisualizer';
import StringVisualizer from '../components/Visualizer/StringVisualizer';
import StepController from '../components/StepController/StepController';
import CodeViewer from '../components/CodeViewer/CodeViewer';
import { getVisibleImplementations } from '../utils/implementationFiles';

function generateRandomArray(size = 10, max = 50): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 1);
}

function formatCategoryName(category: string): string {
  return category
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

type SortingScenarioPreset = {
  id: string;
  label: string;
  description: string;
  values: number[];
};

const SORTING_SCENARIOS: SortingScenarioPreset[] = [
  {
    id: 'warehouse-picks',
    label: 'Warehouse Picks',
    description: 'Each bar is a pick ticket priority in a fulfillment center. The algorithm is reordering which package gets handled next.',
    values: [42, 18, 67, 9, 31, 55, 14, 73, 26, 49],
  },
  {
    id: 'rush-hour-lanes',
    label: 'Rush Hour Lanes',
    description: 'Treat the values as lane congestion scores. The visualization shows how a traffic controller would gradually group the most delayed lanes.',
    values: [64, 22, 58, 11, 47, 39, 72, 16, 53, 28],
  },
  {
    id: 'leaderboard-refresh',
    label: 'Leaderboard Refresh',
    description: 'Think of the bars as player scores. The algorithm is updating the visible ranking as new comparisons are resolved.',
    values: [37, 81, 24, 68, 15, 59, 92, 33, 46, 71],
  },
];

type PathfindingBoardConfig = {
  rows: number;
  cols: number;
  blockedCellIds: string[];
  startNodeId: string;
  targetNodeId: string;
  weightedCellCosts?: Record<string, number>;
};

const PATHFINDING_GRID_SLUGS = new Set(['breadth-first-search', 'dijkstras', 'a-star-search']);

function createPathfindingCellId(row: number, col: number): string {
  return `${row}-${col}`;
}

function getDefaultPathfindingBoard(slug?: string): PathfindingBoardConfig {
  const weightedCellCosts =
    slug === 'dijkstras' || slug === 'a-star-search'
      ? {
          [createPathfindingCellId(1, 9)]: 4,
          [createPathfindingCellId(2, 9)]: 4,
          [createPathfindingCellId(3, 9)]: 4,
          [createPathfindingCellId(4, 9)]: 3,
          [createPathfindingCellId(5, 8)]: 3,
          [createPathfindingCellId(5, 9)]: 3,
        }
      : undefined;

  return {
    rows: 8,
    cols: 14,
    blockedCellIds: [
      createPathfindingCellId(1, 3),
      createPathfindingCellId(2, 3),
      createPathfindingCellId(3, 3),
      createPathfindingCellId(4, 3),
      createPathfindingCellId(5, 3),
      createPathfindingCellId(2, 6),
      createPathfindingCellId(2, 7),
      createPathfindingCellId(2, 8),
      createPathfindingCellId(5, 6),
      createPathfindingCellId(5, 7),
      createPathfindingCellId(5, 10),
      createPathfindingCellId(4, 10),
      createPathfindingCellId(3, 10),
      createPathfindingCellId(6, 10),
    ],
    startNodeId: createPathfindingCellId(1, 1),
    targetNodeId: createPathfindingCellId(6, 12),
    weightedCellCosts,
  };
}

function buildPathfindingGridData(board: PathfindingBoardConfig, useWeights: boolean) {
  const blockedSet = new Set(board.blockedCellIds);
  const nodes: Array<{ id: string; label: string; row: number; col: number; blocked: boolean; cost: number }> = [];
  const edges: Array<{ source: string; target: string; weight?: number; directed?: boolean }> = [];

  for (let row = 0; row < board.rows; row++) {
    for (let col = 0; col < board.cols; col++) {
      const id = createPathfindingCellId(row, col);
      const blocked = blockedSet.has(id);
      const cost = board.weightedCellCosts?.[id] ?? 1;

      nodes.push({
        id,
        label: '',
        row,
        col,
        blocked,
        cost,
      });
    }
  }

  for (let row = 0; row < board.rows; row++) {
    for (let col = 0; col < board.cols; col++) {
      const sourceId = createPathfindingCellId(row, col);
      if (blockedSet.has(sourceId)) {
        continue;
      }

      const neighbors: Array<[number, number]> = [
        [row - 1, col],
        [row, col - 1],
        [row, col + 1],
        [row + 1, col],
      ];

      neighbors.forEach(([nextRow, nextCol]) => {
        if (nextRow < 0 || nextCol < 0 || nextRow >= board.rows || nextCol >= board.cols) {
          return;
        }

        const targetId = createPathfindingCellId(nextRow, nextCol);
        if (blockedSet.has(targetId)) {
          return;
        }

        edges.push({
          source: sourceId,
          target: targetId,
          weight: useWeights ? board.weightedCellCosts?.[targetId] ?? 1 : 1,
          directed: true,
        });
      });
    }
  }

  return {
    nodes,
    edges,
    startNodeId: board.startNodeId,
    targetNodeId: board.targetNodeId,
  };
}

function countTreeNodes(root: TreeNodeData | null): number {
  if (!root) {
    return 0;
  }

  const leftCount = root.left ? countTreeNodes(root.left) : 0;
  const rightCount = root.right ? countTreeNodes(root.right) : 0;
  const childCount = root.children?.reduce((total, child) => total + countTreeNodes(child), 0) ?? 0;

  return 1 + leftCount + rightCount + childCount;
}

function getRealWorldLens(category: string, algorithmName: string, vizType: VisualizationType): { title: string; summary: string } {
  switch (vizType) {
    case 'graph':
      return {
        title: 'Route Planning Control Room',
        summary: `${algorithmName} behaves like a dispatcher evaluating roads, flights, or network links to find reliable paths through a changing map.`,
      };
    case 'tree':
      return {
        title: 'Catalog and Decision Trees',
        summary: `${algorithmName} mirrors how search indexes, product menus, and decision engines keep hierarchical data easy to navigate.`,
      };
    case 'dp':
      return {
        title: 'Budget and Capacity Planning',
        summary: `${algorithmName} acts like an operations planner testing partial choices, storing the best sub-results, and avoiding repeated work.`,
      };
    case 'string':
      return {
        title: 'Search and Detection Pipeline',
        summary: `${algorithmName} matches the way editors, search bars, and monitoring systems scan text streams for meaningful patterns.`,
      };
    case 'sorting':
    default:
      return {
        title: category === 'searching' ? 'Priority Queue Triage' : 'Fulfillment Line Reordering',
        summary: `${algorithmName} can be read as a real queue-management problem: compare nearby jobs, correct the wrong order, and lock finished work into place.`,
      };
  }
}

function buildLiveNarrative(vizType: VisualizationType, state: AnyVisualizationState, algorithmName: string): string {
  switch (vizType) {
    case 'graph': {
      const graphState = state as GraphVisualizationState;
      const touchedNodes = graphState.nodes.filter((node) => !node.blocked && node.color !== '#64748b').length;
      const highlightedEdges = graphState.edges.filter((edge) => edge.color !== '#94a3b8' && edge.color !== '#64748b').length;

      return `${algorithmName} has touched ${touchedNodes} nodes and ${highlightedEdges} active edges so far, similar to a navigator narrowing down safe or cheap routes before committing.`;
    }
    case 'tree': {
      const treeState = state as TreeVisualizationState;
      const totalNodes = countTreeNodes(treeState.root);

      return `${treeState.highlightedNodes.length} of ${totalNodes || 0} visible nodes are in focus, which mirrors how an index walks down only the relevant branches instead of scanning everything.`;
    }
    case 'dp': {
      const dpState = state as DPVisualizationState;
      const filledCells = dpState.table.flat().filter((cell) => cell.value !== '' && cell.value !== '-').length;
      const currentCell = dpState.currentCell ? `row ${dpState.currentCell[0] + 1}, col ${dpState.currentCell[1] + 1}` : 'the next pending cell';

      return `${filledCells} subproblems are already solved. The current focus is ${currentCell}, showing how the algorithm turns a large planning problem into reusable smaller decisions.`;
    }
    case 'string': {
      const stringState = state as StringVisualizationState;

      return `The pattern is aligned at offset ${stringState.patternOffset}, similar to how a search engine slides a query window across a document until the evidence lines up.`;
    }
    case 'sorting':
    default: {
      const sortingState = state as VisualizationState;
      const highlightedValues = sortingState.highlights.map((item) => sortingState.data[item.index]).filter((value) => value !== undefined);
      const activeValues = highlightedValues.length > 0 ? highlightedValues.join(' and ') : 'the next undecided items';
      const settled = `${sortingState.sorted.length}/${sortingState.data.length}`;
      const action =
        sortingState.swaps.length > 0
          ? 'Two tasks are trading places because the current order is wrong.'
          : sortingState.comparisons.length > 0
            ? 'The queue is being inspected before any move is made.'
            : 'A completed decision is being locked into place.';

      return `The algorithm is currently inspecting ${activeValues}. ${action} ${settled} positions are already fixed, the same way a warehouse line gradually settles urgent jobs into their final order.`;
    }
  }
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    beginner:
      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    intermediate:
      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    advanced:
      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  };

  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize ${
        colors[difficulty] || colors.beginner
      }`}
    >
      {difficulty}
    </span>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  const codeBlocks: string[] = [];
  let html = content.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    const token = `@@CODEBLOCK_${codeBlocks.length}@@`;
    codeBlocks.push(`<pre><code>${escapeHtml(code)}</code></pre>`);
    return token;
  });

  html = html
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/g, (_match, header, body) => {
      const headerCells = header.split('|').map((c: string) => c.trim()).filter(Boolean);
      const rows = body.trim().split('\n').map((row: string) =>
        row.split('|').map((c: string) => c.trim()).filter(Boolean)
      );

      let table = '<div><table>';
      table += '<thead><tr>';
      headerCells.forEach((cell: string) => {
        table += `<th>${cell}</th>`;
      });
      table += '</tr></thead><tbody>';
      rows.forEach((row: string[]) => {
        table += '<tr>';
        row.forEach((cell: string) => {
          table += `<td>${cell}</td>`;
        });
        table += '</tr>';
      });
      table += '</tbody></table></div>';
      return table;
    })
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^- (.+)$/gm, '<li data-list="ul">$1</li>')
    .replace(/^\d+\.\s+(.+)$/gm, '<li data-list="ol">$1</li>')
    .replace(/((?:<li data-list="ul">.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    .replace(/((?:<li data-list="ol">.*<\/li>\n?)+)/g, '<ol>$1</ol>')
    .replace(/<li data-list="(?:ul|ol)">/g, '<li>')
    .replace(/^(?!@@CODEBLOCK_\d+@@)(?!<[a-z])((?!^\s*$).+)$/gm, '<p>$1</p>')
    .replace(/^---$/gm, '<hr />');

  html = html.replace(/@@CODEBLOCK_(\d+)@@/g, (_match, idx) => codeBlocks[Number(idx)] ?? '');

  return (
    <div
      className="mt-2 max-w-none text-[1.02rem] text-slate-700 dark:text-slate-200 [&_h1]:mb-5 [&_h1]:text-4xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-slate-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-slate-900 [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-slate-900 [&_p]:my-4 [&_p]:leading-8 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_li]:leading-7 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-slate-200 [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-6 [&_pre]:text-slate-100 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.92em] [&_code]:text-slate-800 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-slate-100 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-cyan-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_strong]:font-semibold [&_strong]:text-slate-900 [&_a]:font-medium [&_a]:text-blue-700 [&_a]:underline-offset-2 hover:[&_a]:underline [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm [&_td]:border [&_td]:border-slate-300 [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm dark:[&_h1]:text-slate-100 dark:[&_h2]:text-slate-100 dark:[&_h3]:text-slate-100 dark:[&_h4]:text-slate-100 dark:[&_code]:bg-slate-800 dark:[&_code]:text-slate-100 dark:[&_strong]:text-slate-100 dark:[&_a]:text-blue-300 dark:[&_th]:border-slate-700 dark:[&_th]:bg-slate-800 dark:[&_th]:text-slate-100 dark:[&_td]:border-slate-700"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function AlgorithmDetail() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const [data, setData] = useState<AlgorithmDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Visualization state
  const [vizEngine, setVizEngine] = useState<AnyVisualizationEngine | null>(null);
  const [vizState, setVizState] = useState<AnyVisualizationState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCodeExpanded, setIsCodeExpanded] = useState(true);
  const [selectedScenarioId, setSelectedScenarioId] = useState(SORTING_SCENARIOS[0].id);
  const [pathfindingBoard, setPathfindingBoard] = useState<PathfindingBoardConfig | null>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPathfindingGridAlgorithm = Boolean(slug && PATHFINDING_GRID_SLUGS.has(slug));
  const speedCap = 4;
  const selectedPlaybackSpeed = isPathfindingGridAlgorithm ? 10 : Math.min(speed, speedCap);
  const effectivePlaybackSpeed = useMemo(() => {
    if (!isPathfindingGridAlgorithm || !isPlaying) {
      return selectedPlaybackSpeed;
    }

    const startSpeed = Math.min(0.75, selectedPlaybackSpeed);
    const rampProgress = Math.min(1, Math.max(0, currentStep - 1) / 12);
    return Number((startSpeed + (selectedPlaybackSpeed - startSpeed) * rampProgress).toFixed(2));
  }, [currentStep, isPathfindingGridAlgorithm, isPlaying, selectedPlaybackSpeed]);
  const playbackIntervalMs = Math.max(
    50,
    (isPathfindingGridAlgorithm ? 550 : 800) / Math.max(effectivePlaybackSpeed, 0.25),
  );
  const speedDisplayLabel = isPathfindingGridAlgorithm
    ? (isPlaying ? `${effectivePlaybackSpeed}x auto` : `Auto up to ${selectedPlaybackSpeed}x`)
    : `${selectedPlaybackSpeed}x`;

  const syncEngineToStep = useCallback((engine: AnyVisualizationEngine, requestedStep: number) => {
    const stepCount = engine.getStepCount();
    if (stepCount <= 0) {
      setVizState(null);
      setCurrentStep(0);
      return;
    }

    const clampedStep = Math.max(1, Math.min(stepCount, requestedStep));
    engine.reset();

    let nextState: AnyVisualizationState | null = null;
    for (let i = 0; i < clampedStep; i++) {
      nextState = engine.step() as AnyVisualizationState | null;
      if (!nextState) {
        break;
      }
    }

    if (nextState) {
      setVizState(nextState);
      setCurrentStep(engine.getCurrentStep() + 1);
    }
  }, []);

  const initializeVisualization = useCallback(
    (engine: AnyVisualizationEngine, sortingData?: number[], boardOverride?: PathfindingBoardConfig) => {
      const vizType = engine.visualizationType ?? 'sorting';

      if (vizType === 'sorting') {
        (engine as { initialize(data: number[]): VisualizationState }).initialize(sortingData ?? SORTING_SCENARIOS[0].values);
      } else if (vizType === 'graph') {
        if (slug && PATHFINDING_GRID_SLUGS.has(slug)) {
          const board = boardOverride ?? getDefaultPathfindingBoard(slug);
          const sample = buildPathfindingGridData(board, slug !== 'breadth-first-search');
          (engine as { initialize(n: unknown[], e: unknown[], s?: string, t?: string): GraphVisualizationState }).initialize(
            sample.nodes,
            sample.edges,
            sample.startNodeId,
            sample.targetNodeId,
          );
        } else {
          const nodes = [
            { id: 'A', label: 'A' }, { id: 'B', label: 'B' }, { id: 'C', label: 'C' },
            { id: 'D', label: 'D' }, { id: 'E', label: 'E' }, { id: 'F', label: 'F' },
          ];
          const edges = [
            { source: 'A', target: 'B', weight: 4 }, { source: 'A', target: 'C', weight: 2 },
            { source: 'B', target: 'D', weight: 3 }, { source: 'C', target: 'D', weight: 1 },
            { source: 'C', target: 'E', weight: 5 }, { source: 'D', target: 'F', weight: 2 },
            { source: 'E', target: 'F', weight: 1 },
          ];
          (engine as { initialize(n: unknown[], e: unknown[], s?: string): GraphVisualizationState }).initialize(nodes, edges, 'A');
        }
      } else if (vizType === 'tree') {
        const values = Array.from({ length: 7 }, () => Math.floor(Math.random() * 99) + 1);
        (engine as { initialize(values: number[]): TreeVisualizationState }).initialize(values);
      } else if (vizType === 'dp') {
        (engine as { initialize(input: Record<string, unknown>): DPVisualizationState }).initialize({ values: [1, 5, 8, 9, 10, 17, 17, 20], target: 8 });
      } else {
        (engine as { initialize(text: string, pattern: string): StringVisualizationState }).initialize('ABABDABACDABABCABAB', 'ABABCABAB');
      }

      setTotalSteps(engine.getStepCount());
      syncEngineToStep(engine, 1);
    },
    [slug, syncEngineToStep]
  );

  // Fetch algorithm data
  useEffect(() => {
    if (!category || !slug) return;

    const controller = new AbortController();

    const loadAlgorithm = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${import.meta.env.BASE_URL}data/algorithms/${category}/${slug}.json`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Algorithm not found (${res.status})`);
        }

        const json = await res.json() as AlgorithmDetailData;
        setData(json);
        setLoading(false);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setError(err instanceof Error ? err.message : 'Failed to load algorithm');
        setLoading(false);
      }
    };

    void loadAlgorithm();

    return () => {
      controller.abort();
    };
  }, [category, slug]);

  // Initialize visualization engine
  useEffect(() => {
    if (!slug) return;

    const setupVisualization = () => {
      const engine = getVisualization(slug);
      if (engine) {
        setVizEngine(engine);
        setSelectedScenarioId(SORTING_SCENARIOS[0].id);
        if (PATHFINDING_GRID_SLUGS.has(slug)) {
          const defaultBoard = getDefaultPathfindingBoard(slug);
          setPathfindingBoard(defaultBoard);
          initializeVisualization(engine, undefined, defaultBoard);
        } else {
          setPathfindingBoard(null);
          initializeVisualization(engine, engine.visualizationType === 'sorting' || !engine.visualizationType ? SORTING_SCENARIOS[0].values : undefined);
        }
      } else {
        setVizEngine(null);
        setVizState(null);
        setTotalSteps(0);
        setCurrentStep(0);
        setPathfindingBoard(null);
      }
    };

    setupVisualization();
  }, [initializeVisualization, slug]);

  // Auto-play interval
  useEffect(() => {
    if (isPlaying && vizEngine) {
      playIntervalRef.current = setInterval(() => {
        const nextState = vizEngine.step();
        if (nextState) {
          setVizState(nextState);
          setCurrentStep(vizEngine.getCurrentStep() + 1);
        } else {
          setIsPlaying(false);
        }
      }, playbackIntervalMs);
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    };
  }, [isPlaying, playbackIntervalMs, vizEngine]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleStepForward = useCallback(() => {
    if (!vizEngine) return;
    setIsPlaying(false);
    const nextState = vizEngine.step();
    if (nextState) {
      setVizState(nextState);
      setCurrentStep(vizEngine.getCurrentStep() + 1);
    }
  }, [vizEngine]);

  const handleStepBackward = useCallback(() => {
    if (!vizEngine || currentStep <= 1) return;
    setIsPlaying(false);
    syncEngineToStep(vizEngine, currentStep - 1);
  }, [currentStep, syncEngineToStep, vizEngine]);

  const handleReset = useCallback(() => {
    if (!vizEngine) return;
    setIsPlaying(false);
    syncEngineToStep(vizEngine, 1);
  }, [syncEngineToStep, vizEngine]);

  const handleSeek = useCallback(
    (step: number) => {
      if (!vizEngine) return;
      setIsPlaying(false);
      syncEngineToStep(vizEngine, step);
    },
    [syncEngineToStep, vizEngine]
  );

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const handleCustomData = useCallback(
    (newData: number[]) => {
      if (!vizEngine) return;
      const vizType = vizEngine.visualizationType ?? 'sorting';
      setIsPlaying(false);
      if (vizType === 'sorting') {
        setSelectedScenarioId('custom');
        initializeVisualization(vizEngine, newData);
      } else {
        initializeVisualization(vizEngine);
      }
    },
    [initializeVisualization, vizEngine]
  );

  const handleRandomize = useCallback(() => {
    if (!vizEngine) return;
    setIsPlaying(false);
    if (isPathfindingGridAlgorithm && slug) {
      const defaultBoard = getDefaultPathfindingBoard(slug);
      setPathfindingBoard(defaultBoard);
      initializeVisualization(vizEngine, undefined, defaultBoard);
    } else if ((vizEngine.visualizationType ?? 'sorting') === 'sorting') {
      setSelectedScenarioId('random');
      initializeVisualization(vizEngine, generateRandomArray(10, 90));
    } else {
      initializeVisualization(vizEngine);
    }
  }, [initializeVisualization, isPathfindingGridAlgorithm, slug, vizEngine]);

  const handleApplyScenario = useCallback(
    (scenarioId: string) => {
      if (!vizEngine) return;
      const preset = SORTING_SCENARIOS.find((scenario) => scenario.id === scenarioId);
      if (!preset) return;

      setIsPlaying(false);
      setSelectedScenarioId(scenarioId);
      initializeVisualization(vizEngine, preset.values);
    },
    [initializeVisualization, vizEngine]
  );

  const applyPathfindingBoard = useCallback(
    (nextBoard: PathfindingBoardConfig) => {
      if (!vizEngine || !isPathfindingGridAlgorithm) return;
      setIsPlaying(false);
      setPathfindingBoard(nextBoard);
      initializeVisualization(vizEngine, undefined, nextBoard);
    },
    [initializeVisualization, isPathfindingGridAlgorithm, vizEngine]
  );

  const handlePathfindingCellToggle = useCallback(
    (cellId: string, blocked: boolean) => {
      if (!pathfindingBoard) return;
      if (cellId === pathfindingBoard.startNodeId || cellId === pathfindingBoard.targetNodeId) return;

      const blockedCells = new Set(pathfindingBoard.blockedCellIds);
      const isCurrentlyBlocked = blockedCells.has(cellId);
      if (isCurrentlyBlocked === blocked) {
        return;
      }

      if (blocked) {
        blockedCells.add(cellId);
      } else {
        blockedCells.delete(cellId);
      }

      applyPathfindingBoard({
        ...pathfindingBoard,
        blockedCellIds: Array.from(blockedCells),
      });
    },
    [applyPathfindingBoard, pathfindingBoard]
  );

  const handlePathfindingStartMove = useCallback(
    (cellId: string) => {
      if (!pathfindingBoard) return;
      if (pathfindingBoard.blockedCellIds.includes(cellId) || cellId === pathfindingBoard.targetNodeId) return;

      applyPathfindingBoard({
        ...pathfindingBoard,
        startNodeId: cellId,
      });
    },
    [applyPathfindingBoard, pathfindingBoard]
  );

  const handlePathfindingTargetMove = useCallback(
    (cellId: string) => {
      if (!pathfindingBoard) return;
      if (pathfindingBoard.blockedCellIds.includes(cellId) || cellId === pathfindingBoard.startNodeId) return;

      applyPathfindingBoard({
        ...pathfindingBoard,
        targetNodeId: cellId,
      });
    },
    [applyPathfindingBoard, pathfindingBoard]
  );

  const implementationStats = useMemo(() => {
    if (!data) {
      return { languages: 0, files: 0 };
    }
    const entries = Object.values(getVisibleImplementations(data.implementations ?? {}));
    return {
      languages: entries.length,
      files: entries.reduce((acc, entry) => acc + (entry.files?.length ?? 0), 0),
    };
  }, [data]);

  const currentVisualizationType = vizEngine?.visualizationType ?? 'sorting';
  const selectedScenario = useMemo(
    () => SORTING_SCENARIOS.find((scenario) => scenario.id === selectedScenarioId),
    [selectedScenarioId]
  );

  const playbackSampleLabel = useMemo(() => {
    if (currentVisualizationType === 'sorting') {
      if (selectedScenarioId === 'custom') {
        return 'Custom values';
      }
      if (selectedScenarioId === 'random') {
        return 'Shuffled values';
      }

      return selectedScenario?.label ?? SORTING_SCENARIOS[0].label;
    }

    switch (currentVisualizationType) {
      case 'graph':
        return isPathfindingGridAlgorithm ? 'Editable grid board' : 'Route map';
      case 'tree':
        return 'Decision tree';
      case 'dp':
        return 'Planning grid';
      case 'string':
        return 'Search text';
      default:
        return 'Sample input';
    }
  }, [currentVisualizationType, isPathfindingGridAlgorithm, selectedScenario, selectedScenarioId]);

  const visualizationLens = useMemo(
    () => getRealWorldLens(data?.category ?? category ?? 'algorithms', data?.name ?? 'This algorithm', currentVisualizationType),
    [category, currentVisualizationType, data?.category, data?.name]
  );

  const liveNarrative = useMemo(() => {
    if (!vizState) {
      return visualizationLens.summary;
    }

    return buildLiveNarrative(currentVisualizationType, vizState, data?.name ?? 'This algorithm');
  }, [currentVisualizationType, data?.name, visualizationLens.summary, vizState]);

  const progressPercent = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-8 w-72 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 h-96 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-500">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Algorithm Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {error || 'The requested algorithm could not be loaded.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Back to Explorer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-800/15" />
        <div className="absolute top-40 -right-24 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-800/15" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link
          to="/"
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Home
        </Link>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
        <Link
          to={`/?category=${encodeURIComponent(data.category)}`}
          className="capitalize hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {formatCategoryName(data.category)}
        </Link>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{data.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8 rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-cyan-50 to-amber-50 p-5 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 sm:p-6">
        <div className="flex items-start gap-3 flex-wrap mb-4">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 [font-family:'Fraunces',Georgia,serif]">
            {data.name}
          </h1>
          <DifficultyBadge difficulty={data.difficulty} />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {formatCategoryName(data.category)} • Interactive visualization, complexity analysis, and multi-language implementations.
        </p>

        {/* Tags */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {data.tags.map((tag) => (
            <Link
              key={tag}
              to={`/?tag=${encodeURIComponent(tag)}`}
              className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-white/90 dark:bg-slate-900/90 text-gray-700 dark:text-gray-300 border border-slate-200 dark:border-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-300 dark:hover:border-blue-700"
            >
              {tag}
            </Link>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Complexity Snapshot
            </h3>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              <div className="col-span-1">
                <dt className="text-slate-500 dark:text-slate-400">Best</dt>
                <dd className="mt-0.5">
                  <span className="inline-block rounded-md border border-emerald-400/40 bg-emerald-100/80 px-2 py-0.5 font-mono text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    {data.complexity.time.best}
                  </span>
                </dd>
              </div>
              <div className="col-span-1">
                <dt className="text-slate-500 dark:text-slate-400">Average</dt>
                <dd className="mt-0.5">
                  <span className="inline-block rounded-md border border-amber-400/40 bg-amber-100/80 px-2 py-0.5 font-mono text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    {data.complexity.time.average}
                  </span>
                </dd>
              </div>
              <div className="col-span-1">
                <dt className="text-slate-500 dark:text-slate-400">Worst</dt>
                <dd className="mt-0.5">
                  <span className="inline-block rounded-md border border-rose-400/40 bg-rose-100/80 px-2 py-0.5 font-mono text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                    {data.complexity.time.worst}
                  </span>
                </dd>
              </div>
              <div className="col-span-1">
                <dt className="text-slate-500 dark:text-slate-400">Space</dt>
                <dd className="mt-0.5">
                  <span className="inline-block rounded-md border border-blue-400/40 bg-blue-100/80 px-2 py-0.5 font-mono text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {data.complexity.space}
                  </span>
                </dd>
              </div>
            </dl>
            {(data.stable !== undefined || data.in_place !== undefined) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {data.stable !== undefined && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {data.stable ? 'Stable' : 'Not stable'}
                  </span>
                )}
                {data.in_place !== undefined && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {data.in_place ? 'In-place' : 'Not in-place'}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Related Algorithms
            </h3>
            <div className="mt-3">
              {data.related && data.related.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.related.map((relatedSlug) => (
                    <Link
                      key={relatedSlug}
                      to={`/algorithm/${data.category}/${relatedSlug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                    >
                      {relatedSlug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No related algorithms listed yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section - Full Width Centerpiece */}
      <div className="mb-8">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500">
              <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2ZM10.5 7A1.5 1.5 0 0 0 9 8.5v8a1.5 1.5 0 0 0 3 0v-8A1.5 1.5 0 0 0 10.5 7ZM5.5 12A1.5 1.5 0 0 0 4 13.5v3a1.5 1.5 0 0 0 3 0v-3A1.5 1.5 0 0 0 5.5 12Z" />
            </svg>
            Visualization
          </h2>
          <div className="mb-5 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/40">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Real-World Lens
              </p>
              <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                {visualizationLens.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {visualizationLens.summary}
              </p>
              <p className="mt-3 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm leading-6 text-cyan-900 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-100">
                {liveNarrative}
              </p>
              {currentVisualizationType === 'sorting' && (
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  {selectedScenario?.description ?? 'Use a preset scenario or your own values to simulate how the algorithm behaves on a realistic workload.'}
                </p>
              )}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>Simulation Progress</span>
                <span>{currentStep}/{totalSteps || 0}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 transition-[width] duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                  <dt className="text-xs text-slate-500 dark:text-slate-400">Mode</dt>
                  <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                    {isPlaying ? 'Autoplay' : 'Manual'}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                  <dt className="text-xs text-slate-500 dark:text-slate-400">Speed</dt>
                  <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                    {speedDisplayLabel}
                  </dd>
                </div>
                <div className="col-span-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                  <dt className="text-xs text-slate-500 dark:text-slate-400">Dataset</dt>
                  <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                    {playbackSampleLabel}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {vizEngine && vizState ? (
            <>
              {(() => {
                const vizType = vizEngine.visualizationType ?? 'sorting';
                switch (vizType) {
                  case 'graph':
                    return (
                      <GraphVisualizer
                        state={vizState as GraphVisualizationState}
                        interactiveGrid={isPathfindingGridAlgorithm}
                        onToggleBlockedCell={handlePathfindingCellToggle}
                        onMoveStartNode={handlePathfindingStartMove}
                        onMoveTargetNode={handlePathfindingTargetMove}
                      />
                    );
                  case 'tree':
                    return <TreeVisualizer state={vizState as TreeVisualizationState} />;
                  case 'dp':
                    return <DPVisualizer state={vizState as DPVisualizationState} />;
                  case 'string':
                    return <StringVisualizer state={vizState as StringVisualizationState} />;
                  default:
                    return <Visualizer state={vizState as VisualizationState} />;
                }
              })()}

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <StepController
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  isPlaying={isPlaying}
                  showSpeedControl={!isPathfindingGridAlgorithm}
                  speed={speed}
                  maxSpeed={speedCap}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onStepBackward={handleStepBackward}
                  onStepForward={handleStepForward}
                  onReset={handleReset}
                  onSeek={handleSeek}
                  onSpeedChange={handleSpeedChange}
                  onCustomData={handleCustomData}
                  onRandomize={handleRandomize}
                  randomizeLabel={
                    currentVisualizationType === 'sorting'
                      ? 'Shuffle Values'
                      : isPathfindingGridAlgorithm
                        ? 'Reset Board'
                        : 'New Example'
                  }
                  showCustomDataControls={currentVisualizationType === 'sorting'}
                  scenarioPresets={currentVisualizationType === 'sorting'
                    ? SORTING_SCENARIOS.map(({ id, label, description }) => ({ id, label, description }))
                    : []}
                  selectedScenarioId={currentVisualizationType === 'sorting' ? selectedScenarioId : null}
                  onApplyScenario={currentVisualizationType === 'sorting' ? handleApplyScenario : undefined}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-gray-400 dark:text-gray-500">
                  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H4.28a.75.75 0 0 0-.75.75v3.955a.75.75 0 0 0 1.5 0v-2.134l.235.234a7 7 0 0 0 11.788-3.04.75.75 0 0 0-1.442-.42ZM4.688 8.576a5.5 5.5 0 0 1 9.201-2.466l.312.311H11.77a.75.75 0 0 0 0 1.5h3.951a.75.75 0 0 0 .75-.75V3.216a.75.75 0 0 0-1.5 0v2.134l-.235-.234A7 7 0 0 0 3.246 8.156a.75.75 0 0 0 1.442.42Z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Interactive visualization coming soon
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Visualizations are available for 35 algorithms across sorting, graph, tree, DP, and string categories.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Full-width collapsible code editor */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsCodeExpanded((prev) => !prev)}
          className="w-full border-b border-slate-200 bg-slate-50/80 px-4 py-3 text-left transition-colors hover:bg-slate-100/80 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800"
          aria-expanded={isCodeExpanded}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500">
                  <path fillRule="evenodd" d="M6.28 5.22a.75.75 0 0 1 0 1.06L2.56 10l3.72 3.72a.75.75 0 0 1-1.06 1.06L.97 10.53a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Zm7.44 0a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
                Implementations
              </h2>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {implementationStats.languages} languages • {implementationStats.files} files
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
              {isCodeExpanded ? 'Collapse' : 'Expand'}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-4 h-4 transition-transform ${isCodeExpanded ? 'rotate-180' : ''}`}
              >
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </button>
        {isCodeExpanded && (
          <div className="p-4 sm:p-5">
            <CodeViewer key={`${data.category}/${data.slug}`} implementations={data.implementations} />
          </div>
        )}
      </div>

      {/* Full-width guide */}
      {data.readme && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900 p-5 sm:p-7 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 [font-family:'Fraunces',Georgia,serif]">
            Algorithm Guide
          </h2>
          <MarkdownRenderer content={data.readme} />
        </div>
      )}
    </div>
    </div>
  );
}
