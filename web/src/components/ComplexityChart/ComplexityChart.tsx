import type { Complexity } from '../../types';

interface ComplexityChartProps {
  complexity: Complexity;
  stable?: boolean;
  inPlace?: boolean;
}

function ComplexityBadge({ value, type }: { value: string; type: 'best' | 'average' | 'worst' | 'space' }) {
  const colorMap = {
    best: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    average: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    worst: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    space: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  };

  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-mono font-medium rounded border ${colorMap[type]}`}>
      {value}
    </span>
  );
}

export default function ComplexityChart({ complexity, stable, inPlace }: ComplexityChartProps) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Complexity Analysis
        </h3>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {/* Time Complexity */}
        <div className="px-4 py-3">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Time Complexity
          </h4>
          <table className="w-full">
            <tbody className="text-sm">
              <tr>
                <td className="py-1.5 text-gray-600 dark:text-gray-400 w-20">Best</td>
                <td className="py-1.5">
                  <ComplexityBadge value={complexity.time.best} type="best" />
                </td>
              </tr>
              <tr>
                <td className="py-1.5 text-gray-600 dark:text-gray-400">Average</td>
                <td className="py-1.5">
                  <ComplexityBadge value={complexity.time.average} type="average" />
                </td>
              </tr>
              <tr>
                <td className="py-1.5 text-gray-600 dark:text-gray-400">Worst</td>
                <td className="py-1.5">
                  <ComplexityBadge value={complexity.time.worst} type="worst" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Space Complexity */}
        <div className="px-4 py-3">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Space Complexity
          </h4>
          <ComplexityBadge value={complexity.space} type="space" />
        </div>

        {/* Properties */}
        {(stable !== undefined || inPlace !== undefined) && (
          <div className="px-4 py-3">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Properties
            </h4>
            <div className="flex gap-2 flex-wrap">
              {stable !== undefined && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border ${
                    stable
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {stable ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                      <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  )}
                  Stable
                </span>
              )}
              {inPlace !== undefined && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border ${
                    inPlace
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {inPlace ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                      <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  )}
                  In-place
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
