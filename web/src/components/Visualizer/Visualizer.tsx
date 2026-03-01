import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { VisualizationState } from '../../visualizations/types';

interface VisualizerProps {
  state: VisualizationState;
}

function getBarColor(
  index: number,
  state: VisualizationState
): string {
  // Check highlights first (comparing / swapping)
  const highlight = state.highlights.find((h) => h.index === index);
  if (highlight) {
    return highlight.color;
  }

  // Sorted
  if (state.sorted.includes(index)) {
    return '#22c55e';
  }

  // Default
  return '#64748b';
}

export default function Visualizer({ state }: VisualizerProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { data, stepDescription } = state;
  const maxVal = Math.max(...data, 1);
  const barCount = data.length;
  const activeIndexSet = useMemo(
    () => new Set(state.highlights.map((highlight) => highlight.index)),
    [state.highlights]
  );
  const hoveredValue = hoveredIndex !== null ? data[hoveredIndex] : null;
  const hoveredHighlight = hoveredIndex !== null
    ? state.highlights.find((highlight) => highlight.index === hoveredIndex)
    : undefined;
  const hoveredRole = hoveredIndex === null
    ? 'Hover a bar to inspect it'
    : hoveredHighlight
      ? hoveredHighlight.color === '#ef4444'
        ? 'Currently swapping'
        : hoveredHighlight.color === '#eab308'
          ? 'Currently being compared'
          : 'Actively highlighted'
      : state.sorted.includes(hoveredIndex)
        ? 'Already locked in place'
        : 'Waiting in the unsorted region';

  return (
    <div className="w-full">
      {/* Bar chart area */}
      <div className="relative bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700/50 overflow-hidden">
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-white/80 px-3 py-2 text-sm shadow-sm ring-1 ring-black/5 dark:bg-gray-900/70 dark:ring-white/10">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Active focus</div>
            <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {activeIndexSet.size > 0 ? `${activeIndexSet.size} items in motion` : 'Waiting for the next move'}
            </div>
          </div>
          <div className="rounded-xl bg-white/80 px-3 py-2 text-sm shadow-sm ring-1 ring-black/5 dark:bg-gray-900/70 dark:ring-white/10">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Settled items</div>
            <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {state.sorted.length}/{barCount} fixed
            </div>
          </div>
          <div className="rounded-xl bg-white/80 px-3 py-2 text-sm shadow-sm ring-1 ring-black/5 dark:bg-gray-900/70 dark:ring-white/10">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Inspection</div>
            <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {hoveredValue !== null ? `Value ${hoveredValue}` : 'Move your pointer'}
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {hoveredRole}
            </div>
          </div>
        </div>
        <div
          className="flex items-end justify-center gap-[2px] sm:gap-1"
          style={{ height: Math.min(320, Math.max(200, barCount * 8)) }}
        >
          {data.map((value, index) => {
            const heightPercent = (value / maxVal) * 100;
            const color = getBarColor(index, state);
            const highlight = state.highlights.find((h) => h.index === index);

            return (
              <motion.div
                key={index}
                className="relative flex flex-col items-center"
                style={{
                  flex: `1 1 0%`,
                  maxWidth: `${Math.max(12, Math.min(60, 600 / barCount))}px`,
                }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex((current) => (current === index ? null : current))}
                whileHover={{ y: -4 }}
              >
                {/* Value label on top */}
                <motion.span
                  className="text-[10px] sm:text-xs font-mono font-medium mb-1 select-none"
                  style={{ color }}
                  initial={false}
                  animate={{ opacity: barCount <= 20 ? 1 : 0 }}
                >
                  {value}
                </motion.span>

                {/* Bar */}
                <motion.div
                  className="w-full rounded-t-sm"
                  initial={false}
                  animate={{
                    height: `${heightPercent}%`,
                    backgroundColor: color,
                    y: highlight ? -6 : 0,
                    scaleX: hoveredIndex === index ? 1.06 : 1,
                  }}
                  transition={{
                    height: { type: 'spring', stiffness: 300, damping: 30 },
                    backgroundColor: { duration: 0.2 },
                    y: { type: 'spring', stiffness: 320, damping: 22 },
                    scaleX: { duration: 0.15 },
                  }}
                  style={{
                    minHeight: 4,
                    boxShadow:
                      highlight
                        ? `0 0 8px ${color}40`
                        : hoveredIndex === index
                          ? '0 0 0 1px rgba(8, 145, 178, 0.4)'
                          : 'none',
                  }}
                />

                {/* Index label below */}
                {barCount <= 20 && (
                  <span className="text-[9px] sm:text-[10px] font-mono text-gray-400 dark:text-gray-500 mt-1 select-none">
                    {index}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#64748b' }} />
            Default
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#eab308' }} />
            Comparing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ef4444' }} />
            Swapping
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#22c55e' }} />
            Sorted
          </span>
        </div>
      </div>

      {/* Step description */}
      <div className="mt-3 px-1">
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium min-h-[2.5rem]">
          {stepDescription}
        </p>
      </div>
    </div>
  );
}
