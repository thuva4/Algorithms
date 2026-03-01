import type { TreeVisualizationState, TreeNodeData } from '../../visualizations/types';

interface TreeVisualizerProps {
  state: TreeVisualizationState;
}

interface PositionedNode {
  id: string;
  value: number | string;
  color: string;
  x: number;
  y: number;
  children: { id: string; x: number; y: number }[];
}

function layoutTree(root: TreeNodeData | null): PositionedNode[] {
  if (!root) return [];

  const nodes: PositionedNode[] = [];
  const levelHeight = 60;
  const baseWidth = 600;

  function traverse(node: TreeNodeData, depth: number, left: number, right: number) {
    const x = (left + right) / 2;
    const y = depth * levelHeight + 40;
    const childLinks: { id: string; x: number; y: number }[] = [];

    if (node.left) {
      const childX = (left + x) / 2;
      const childY = (depth + 1) * levelHeight + 40;
      childLinks.push({ id: node.left.id, x: childX, y: childY });
      traverse(node.left, depth + 1, left, x);
    }

    if (node.right) {
      const childX = (x + right) / 2;
      const childY = (depth + 1) * levelHeight + 40;
      childLinks.push({ id: node.right.id, x: childX, y: childY });
      traverse(node.right, depth + 1, x, right);
    }

    if (node.children) {
      const count = node.children.length;
      const step = (right - left) / (count + 1);
      node.children.forEach((child, i) => {
        const childX = left + step * (i + 1);
        const childY = (depth + 1) * levelHeight + 40;
        childLinks.push({ id: child.id, x: childX, y: childY });
        traverse(child, depth + 1, childX - step / 2, childX + step / 2);
      });
    }

    nodes.push({ id: node.id, value: node.value, color: node.color, x, y, children: childLinks });
  }

  traverse(root, 0, 0, baseWidth);
  return nodes;
}

export default function TreeVisualizer({ state }: TreeVisualizerProps) {
  const { root, highlightedNodes, stepDescription } = state;
  const positioned = layoutTree(root);

  const maxY = positioned.reduce((max, n) => Math.max(max, n.y), 0) + 60;
  const width = 600;
  const height = Math.max(200, maxY);

  return (
    <div className="w-full">
      <div className="relative bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700/50 overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 400 }}>
          {/* Edges */}
          {positioned.map((node) =>
            node.children.map((child) => (
              <line
                key={`${node.id}-${child.id}`}
                x1={node.x}
                y1={node.y}
                x2={child.x}
                y2={child.y}
                stroke="#94a3b8"
                strokeWidth={2}
                className="dark:stroke-gray-600"
              />
            ))
          )}

          {/* Nodes */}
          {positioned.map((node) => {
            const isHighlighted = highlightedNodes.includes(node.id);
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={18}
                  fill={node.color}
                  stroke={isHighlighted ? '#f59e0b' : '#374151'}
                  strokeWidth={isHighlighted ? 3 : 2}
                  className="dark:stroke-gray-500"
                />
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-xs font-semibold fill-white"
                  fontSize={12}
                >
                  {node.value}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#64748b' }} />
            Default
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#eab308' }} />
            Current
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }} />
            Visited
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
            Found
          </span>
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
