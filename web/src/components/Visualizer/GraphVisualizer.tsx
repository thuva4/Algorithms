import { useMemo, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import type { GraphNode, GraphVisualizationState } from '../../visualizations/types';

interface GraphVisualizerProps {
  state: GraphVisualizationState;
  interactiveGrid?: boolean;
  onToggleBlockedCell?: (cellId: string, blocked: boolean) => void;
  onMoveStartNode?: (cellId: string) => void;
  onMoveTargetNode?: (cellId: string) => void;
}

type GridDragMode = 'paint-wall' | 'erase-wall' | 'move-start' | 'move-target' | null;

export default function GraphVisualizer({
  state,
  interactiveGrid = false,
  onToggleBlockedCell,
  onMoveStartNode,
  onMoveTargetNode,
}: GraphVisualizerProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const dragModeRef = useRef<GridDragMode>(null);
  const { nodes, edges, stepDescription } = state;
  const width = 600;
  const height = 400;
  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const startNodeId = state.startNodeId ?? nodes.find((node) => !node.blocked)?.id ?? nodes[0]?.id;
  const targetNodeId = state.targetNodeId;
  const stats = state.stats ?? {
    visitedCount: nodes.filter((node) => node.color !== '#64748b' && node.color !== '#a855f7' && !node.blocked).length,
    frontierCount: nodes.filter((node) => node.color === '#a855f7').length,
    pathCount: nodes.filter((node) => node.color === '#3b82f6').length,
  };
  const hoveredNode = hoveredNodeId ? nodeMap.get(hoveredNodeId) : null;
  const routeVisible = stats.pathCount > 0;
  const isGridMode = nodes.length > 0 && nodes.every((node) => typeof node.row === 'number' && typeof node.col === 'number');

  const gridMetrics = useMemo(() => {
    if (!isGridMode) {
      return null;
    }

    const rows = Math.max(...nodes.map((node) => node.row ?? 0)) + 1;
    const cols = Math.max(...nodes.map((node) => node.col ?? 0)) + 1;
    const cellSize = Math.max(24, Math.min(40, Math.floor(Math.min(540 / cols, 320 / rows))));
    const boardWidth = cols * cellSize;
    const boardHeight = rows * cellSize;
    const offsetX = Math.max(24, (width - boardWidth) / 2);
    const offsetY = Math.max(24, (height - boardHeight) / 2);

    return { rows, cols, cellSize, boardWidth, boardHeight, offsetX, offsetY };
  }, [isGridMode, nodes]);

  const applyGridInteraction = (node: GraphNode) => {
    switch (dragModeRef.current) {
      case 'paint-wall':
        if (node.id !== startNodeId && node.id !== targetNodeId) {
          onToggleBlockedCell?.(node.id, true);
        }
        break;
      case 'erase-wall':
        onToggleBlockedCell?.(node.id, false);
        break;
      case 'move-start':
        if (!node.blocked && node.id !== targetNodeId) {
          onMoveStartNode?.(node.id);
        }
        break;
      case 'move-target':
        if (!node.blocked && node.id !== startNodeId) {
          onMoveTargetNode?.(node.id);
        }
        break;
      default:
        break;
    }
  };

  const beginGridInteraction = (node: GraphNode) => {
    if (!interactiveGrid) {
      return;
    }

    if (node.id === startNodeId) {
      dragModeRef.current = 'move-start';
      return;
    }

    if (node.id === targetNodeId) {
      dragModeRef.current = 'move-target';
      return;
    }

    dragModeRef.current = node.blocked ? 'erase-wall' : 'paint-wall';
    applyGridInteraction(node);
  };

  const endGridInteraction = () => {
    dragModeRef.current = null;
  };

  return (
    <div className="w-full" onPointerUp={endGridInteraction} onPointerLeave={endGridInteraction}>
      <div className="relative bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700/50 overflow-hidden">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <StatCard label="Start" value={startNodeId ?? 'N/A'} />
          <StatCard label="Target" value={targetNodeId ?? 'Traversal'} />
          <StatCard label="Visited" value={`${stats.visitedCount}/${nodes.filter((node) => !node.blocked).length || 0}`} />
          <StatCard
            label={routeVisible ? 'Route' : 'Frontier'}
            value={routeVisible ? `${stats.pathCount} cells` : `${stats.frontierCount} cells`}
          />
        </div>

        {isGridMode && interactiveGrid ? (
          <div className="mb-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
            Drag across cells to paint or erase walls. Drag the start or target cell to move it, then replay the algorithm on the updated maze.
          </div>
        ) : (
          <div className="mb-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
            This graph surface is now styled more like a pathfinding board: the active route glows, the frontier stays visible, and start/target nodes keep their identity across steps.
          </div>
        )}

        {isGridMode && gridMetrics ? (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 400 }}>
            <defs>
              <pattern id="graph-grid-pattern" width={gridMetrics.cellSize} height={gridMetrics.cellSize} patternUnits="userSpaceOnUse">
                <path d={`M ${gridMetrics.cellSize} 0 L 0 0 0 ${gridMetrics.cellSize}`} fill="none" stroke="rgba(148, 163, 184, 0.18)" strokeWidth="1" />
              </pattern>
              <filter id="graph-glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect
              x={gridMetrics.offsetX}
              y={gridMetrics.offsetY}
              width={gridMetrics.boardWidth}
              height={gridMetrics.boardHeight}
              rx="16"
              fill="url(#graph-grid-pattern)"
            />

            {nodes.map((node) => {
              const row = node.row ?? 0;
              const col = node.col ?? 0;
              const x = gridMetrics.offsetX + col * gridMetrics.cellSize;
              const y = gridMetrics.offsetY + row * gridMetrics.cellSize;
              const isStart = node.id === startNodeId;
              const isTarget = node.id === targetNodeId;
              const isHovered = node.id === hoveredNodeId;
              const fill = node.blocked ? '#111827' : node.color;

              return (
                <g key={node.id}>
                  <motion.rect
                    x={x + 1.5}
                    y={y + 1.5}
                    width={gridMetrics.cellSize - 3}
                    height={gridMetrics.cellSize - 3}
                    rx="6"
                    fill={fill}
                    initial={false}
                    animate={{
                      scale: isHovered ? 1.03 : 1,
                      opacity: node.blocked ? 1 : routeVisible && node.color === '#3b82f6' ? [0.8, 1, 0.8] : 1,
                    }}
                    transition={{
                      scale: { duration: 0.12 },
                      opacity: {
                        duration: routeVisible && node.color === '#3b82f6' ? 1.2 : 0.2,
                        repeat: routeVisible && node.color === '#3b82f6' ? Number.POSITIVE_INFINITY : 0,
                        ease: 'easeInOut',
                      },
                    }}
                    filter={node.color === '#3b82f6' || node.color === '#ef4444' ? 'url(#graph-glow)' : undefined}
                    onHoverStart={() => setHoveredNodeId(node.id)}
                    onHoverEnd={() => setHoveredNodeId((current) => (current === node.id ? null : current))}
                    onPointerDown={() => beginGridInteraction(node)}
                    onPointerEnter={() => {
                      setHoveredNodeId(node.id);
                      if (dragModeRef.current) {
                        applyGridInteraction(node);
                      }
                    }}
                    className={interactiveGrid ? 'cursor-pointer' : undefined}
                  />

                  {(isStart || isTarget) && (
                    <>
                      <rect
                        x={x + 4}
                        y={y + 4}
                        width={gridMetrics.cellSize - 8}
                        height={gridMetrics.cellSize - 8}
                        rx="5"
                        fill="none"
                        stroke={isStart ? '#10b981' : '#f97316'}
                        strokeWidth={2.5}
                      />
                      <text
                        x={x + gridMetrics.cellSize / 2}
                        y={y + gridMetrics.cellSize / 2 + 1}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-[9px] font-bold fill-white"
                        fontSize={9}
                      >
                        {isStart ? 'S' : 'T'}
                      </text>
                    </>
                  )}

                  {!node.blocked && node.cost && node.cost > 1 && !isStart && !isTarget && (
                    <text
                      x={x + gridMetrics.cellSize / 2}
                      y={y + gridMetrics.cellSize / 2 + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-[9px] font-semibold fill-white"
                      fontSize={9}
                    >
                      {node.cost}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        ) : (
          <NodeLinkGraph
            width={width}
            height={height}
            nodes={nodes}
            edges={edges}
            hoveredNodeId={hoveredNodeId}
            setHoveredNodeId={setHoveredNodeId}
            startNodeId={startNodeId}
            targetNodeId={targetNodeId}
          />
        )}

        <div className="mt-4 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-slate-200 bg-white/80 px-3 py-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
            <div className="font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Board Status</div>
            <div className="mt-2">
              {routeVisible
                ? 'A candidate route is currently visible. This is the same kind of “path reveal” feedback users expect from a pathfinding playground.'
                : 'The board is still exploring. Frontier cells show where the next expansion wave will move, similar to a maze visualizer.'}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/80 px-3 py-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
            <div className="font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Hover Inspect</div>
            <div className="mt-2">
              {hoveredNode
                ? describeNodeRole(hoveredNode, startNodeId, targetNodeId)
                : 'Move over a node or cell to inspect its current role.'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
          <LegendSwatch color="#64748b" label="Unvisited" />
          <LegendSwatch color="#a855f7" label="Frontier" />
          <LegendSwatch color="#eab308" label="Visiting" />
          <LegendSwatch color="#22c55e" label="Visited" />
          <LegendSwatch color="#3b82f6" label="Shortest Path" />
          <LegendSwatch color="#111827" label="Wall" />
          <LegendSwatch color="transparent" borderColor="#10b981" label="Start" />
          <LegendSwatch color="transparent" borderColor="#f97316" label="Target" />
        </div>
      </div>

      <div className="mt-3 px-1">
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium min-h-[2.5rem]">
          {stepDescription}
        </p>
      </div>
    </div>
  );
}

function NodeLinkGraph({
  width,
  height,
  nodes,
  edges,
  hoveredNodeId,
  setHoveredNodeId,
  startNodeId,
  targetNodeId,
}: {
  width: number;
  height: number;
  nodes: GraphNode[];
  edges: GraphVisualizationState['edges'];
  hoveredNodeId: string | null;
  setHoveredNodeId: Dispatch<SetStateAction<string | null>>;
  startNodeId?: string;
  targetNodeId?: string;
}) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 400 }}>
      <defs>
        <pattern id="graph-grid-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(148, 163, 184, 0.18)" strokeWidth="1" />
        </pattern>
        <filter id="graph-glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width={width} height={height} rx="20" fill="url(#graph-grid-pattern)" />

      {edges.map((edge, i) => {
        const sourceNode = nodes.find((node) => node.id === edge.source);
        const targetNode = nodes.find((node) => node.id === edge.target);
        if (!sourceNode || !targetNode) {
          return null;
        }

        const isActiveEdge = edge.color === '#3b82f6' || edge.color === '#ef4444';

        return (
          <g key={`edge-${i}`}>
            <motion.line
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke={edge.color}
              strokeWidth={isActiveEdge ? 4 : 2.5}
              strokeOpacity={isActiveEdge ? 1 : 0.8}
              strokeDasharray={edge.color === '#ef4444' ? '6 4' : undefined}
              initial={false}
              animate={{ opacity: isActiveEdge ? [0.75, 1, 0.75] : 0.8 }}
              transition={{
                duration: isActiveEdge ? 1.4 : 0.2,
                repeat: isActiveEdge ? Number.POSITIVE_INFINITY : 0,
                ease: 'easeInOut',
              }}
              filter={isActiveEdge ? 'url(#graph-glow)' : undefined}
            />
            {edge.weight !== undefined && (
              <text
                x={(sourceNode.x + targetNode.x) / 2}
                y={(sourceNode.y + targetNode.y) / 2 - 8}
                textAnchor="middle"
                className="text-xs fill-gray-600 dark:fill-gray-400"
                fontSize={11}
              >
                {edge.weight}
              </text>
            )}
            {edge.directed && (
              <polygon
                points={computeArrowHead(sourceNode.x, sourceNode.y, targetNode.x, targetNode.y)}
                fill={edge.color}
              />
            )}
          </g>
        );
      })}

      {nodes.map((node) => {
        const isStart = node.id === startNodeId;
        const isTarget = node.id === targetNodeId;
        const isHovered = node.id === hoveredNodeId;
        const ringColor = isStart ? '#10b981' : isTarget ? '#f97316' : '#94a3b8';

        return (
          <motion.g
            key={node.id}
            initial={false}
            animate={{ scale: isHovered ? 1.06 : 1 }}
            onHoverStart={() => setHoveredNodeId(node.id)}
            onHoverEnd={() => setHoveredNodeId((current) => (current === node.id ? null : current))}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={26}
              fill="none"
              stroke={ringColor}
              strokeWidth={isStart || isTarget ? 2.5 : 1.5}
              strokeOpacity={isStart || isTarget ? 0.95 : 0.35}
              strokeDasharray={isStart || isTarget ? undefined : '4 4'}
            />
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={20}
              fill={node.color}
              stroke="#374151"
              strokeWidth={2}
              className="dark:stroke-gray-500"
              filter={node.color === '#3b82f6' || node.color === '#ef4444' ? 'url(#graph-glow)' : undefined}
            />
            <text
              x={node.x}
              y={node.y + 1}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-xs font-semibold fill-white"
              fontSize={12}
            >
              {node.label}
            </text>
            {(isStart || isTarget) && (
              <text
                x={node.x}
                y={node.y - 28}
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-600 dark:fill-slate-300"
                fontSize={10}
              >
                {isStart ? 'START' : 'TARGET'}
              </text>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}

function describeNodeRole(node: GraphNode, startNodeId?: string, targetNodeId?: string): string {
  if (node.id === startNodeId) {
    return 'This is the start point. Drag it to a different open cell to reroute the search.';
  }

  if (node.id === targetNodeId) {
    return 'This is the target point. Drag it to move the destination and recompute the path.';
  }

  if (node.blocked) {
    return 'This cell is a wall. Drag across it to erase the obstacle.';
  }

  if (node.color === '#3b82f6') {
    return 'This cell is on the currently highlighted route.';
  }

  if (node.color === '#a855f7') {
    return 'This cell is on the frontier and will likely be explored next.';
  }

  if (node.color === '#22c55e') {
    return 'This cell has already been fully explored.';
  }

  if (node.color === '#eab308') {
    return 'This cell is being processed right now.';
  }

  if (node.cost && node.cost > 1) {
    return `This cell is traversable but expensive (cost ${node.cost}), so weighted algorithms will try to avoid it when cheaper routes exist.`;
  }

  return 'This cell is open and currently unvisited.';
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/90 px-3 py-2 shadow-sm ring-1 ring-black/5 dark:bg-slate-900/80 dark:ring-white/10">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</div>
    </div>
  );
}

function LegendSwatch({ color, label, borderColor }: { color: string; label: string; borderColor?: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="w-3 h-3 rounded-sm"
        style={{ backgroundColor: color, border: borderColor ? `2px solid ${borderColor}` : undefined }}
      />
      {label}
    </span>
  );
}

function computeArrowHead(x1: number, y1: number, x2: number, y2: number): string {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const nodeRadius = 20;
  const tipX = x2 - nodeRadius * Math.cos(angle);
  const tipY = y2 - nodeRadius * Math.sin(angle);
  const arrowLen = 10;
  const arrowAngle = Math.PI / 6;

  const p1x = tipX - arrowLen * Math.cos(angle - arrowAngle);
  const p1y = tipY - arrowLen * Math.sin(angle - arrowAngle);
  const p2x = tipX - arrowLen * Math.cos(angle + arrowAngle);
  const p2y = tipY - arrowLen * Math.sin(angle + arrowAngle);

  return `${tipX},${tipY} ${p1x},${p1y} ${p2x},${p2y}`;
}
