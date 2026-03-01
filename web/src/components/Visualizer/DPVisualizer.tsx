import type { DPVisualizationState } from '../../visualizations/types';

interface DPVisualizerProps {
  state: DPVisualizationState;
}

export default function DPVisualizer({ state }: DPVisualizerProps) {
  const { table, rowLabels, colLabels, currentCell, stepDescription } = state;

  return (
    <div className="w-full">
      <div className="relative bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700/50 overflow-x-auto">
        <table className="border-collapse mx-auto">
          {/* Column headers */}
          <thead>
            <tr>
              <th className="w-10 h-10" />
              {colLabels.map((label, j) => (
                <th
                  key={j}
                  className="w-12 h-10 text-center text-xs font-mono font-semibold text-gray-600 dark:text-gray-400"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, i) => (
              <tr key={i}>
                {/* Row header */}
                <td className="w-10 h-12 text-center text-xs font-mono font-semibold text-gray-600 dark:text-gray-400 pr-2">
                  {rowLabels[i] ?? i}
                </td>
                {row.map((cell, j) => {
                  const isCurrent = currentCell && currentCell[0] === i && currentCell[1] === j;
                  return (
                    <td
                      key={j}
                      className="w-12 h-12 text-center border border-gray-300 dark:border-gray-600 text-sm font-mono transition-colors duration-200"
                      style={{
                        backgroundColor: cell.color,
                        outline: isCurrent ? '3px solid #f59e0b' : 'none',
                        outlineOffset: -1,
                        fontWeight: isCurrent ? 700 : 400,
                        color: isLightColor(cell.color) ? '#1f2937' : '#f9fafb',
                      }}
                    >
                      {cell.value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#e5e7eb' }} />
            Empty
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#fbbf24' }} />
            Computing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#60a5fa' }} />
            Computed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#34d399' }} />
            Optimal
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

function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length !== 6) return true;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}
