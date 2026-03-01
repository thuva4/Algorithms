import type { StringVisualizationState } from '../../visualizations/types';

interface StringVisualizerProps {
  state: StringVisualizationState;
}

export default function StringVisualizer({ state }: StringVisualizerProps) {
  const { text, pattern, patternOffset, auxiliaryData, stepDescription } = state;

  return (
    <div className="w-full">
      <div className="relative bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700/50 overflow-x-auto">
        {/* Text row */}
        <div className="mb-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mr-3 inline-block w-14">Text:</span>
          <div className="inline-flex gap-0.5">
            {text.map((cell, i) => (
              <div
                key={i}
                className="w-8 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded text-sm font-mono font-semibold transition-colors duration-200"
                style={{
                  backgroundColor: cell.color,
                  color: isLightColor(cell.color) ? '#1f2937' : '#f9fafb',
                }}
              >
                {cell.char}
              </div>
            ))}
          </div>
        </div>

        {/* Index row */}
        <div className="mb-4">
          <span className="inline-block w-14 mr-3" />
          <div className="inline-flex gap-0.5">
            {text.map((_, i) => (
              <div
                key={i}
                className="w-8 text-center text-[10px] font-mono text-gray-400 dark:text-gray-500"
              >
                {i}
              </div>
            ))}
          </div>
        </div>

        {/* Pattern row (offset by patternOffset) */}
        <div className="mb-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mr-3 inline-block w-14">Pattern:</span>
          <div className="inline-flex gap-0.5" style={{ marginLeft: `${patternOffset * 34}px` }}>
            {pattern.map((cell, i) => (
              <div
                key={i}
                className="w-8 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded text-sm font-mono font-semibold transition-colors duration-200"
                style={{
                  backgroundColor: cell.color,
                  color: isLightColor(cell.color) ? '#1f2937' : '#f9fafb',
                }}
              >
                {cell.char}
              </div>
            ))}
          </div>
        </div>

        {/* Auxiliary data (failure function, hash values, etc.) */}
        {auxiliaryData && auxiliaryData.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {auxiliaryData.map((row, idx) => (
              <div key={idx} className="mb-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mr-3 inline-block w-14">
                  {row.label}:
                </span>
                <div className="inline-flex gap-0.5">
                  {row.values.map((val, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded text-xs font-mono bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                    >
                      {val}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#e5e7eb' }} />
            Default
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#fbbf24' }} />
            Comparing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#34d399' }} />
            Match
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#f87171' }} />
            Mismatch
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
