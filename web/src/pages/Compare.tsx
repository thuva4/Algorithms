import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { AlgorithmSummary, AlgorithmIndex } from '../types';
import type { AlgorithmVisualization, VisualizationState } from '../visualizations/types';
import { getVisualization, hasVisualization } from '../visualizations/registry';
import Visualizer from '../components/Visualizer/Visualizer';

// ── Sorting slugs that work with the bar chart Visualizer ────────────
const SORTING_VIZ_SLUGS = new Set([
  'bubble-sort',
  'insertion-sort',
  'selection-sort',
  'merge-sort',
  'quick-sort',
  'heap-sort',
  'counting-sort',
  'radix-sort',
  'shell-sort',
]);

// ── Helpers ──────────────────────────────────────────────────────────

function generateRandomArray(size = 20, max = 50): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 1);
}

// ── Per-algorithm runtime state ──────────────────────────────────────

interface AlgorithmSlot {
  summary: AlgorithmSummary;
  engine: AlgorithmVisualization;
  state: VisualizationState;
  currentStep: number;
  totalSteps: number;
  finished: boolean;
  finishOrder: number | null; // 1-indexed order of completion
}

// ── CompareSelector ──────────────────────────────────────────────────

function CompareSelector({
  algorithms,
  selected,
  onSelect,
  onRemove,
  onCompare,
  loading,
}: {
  algorithms: AlgorithmSummary[];
  selected: AlgorithmSummary[];
  onSelect: (algo: AlgorithmSummary) => void;
  onRemove: (slug: string) => void;
  onCompare: () => void;
  loading: boolean;
}) {
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return algorithms.filter((a) => {
      if (selected.some((s) => s.slug === a.slug)) return false;
      if (!q) return true;
      return a.name.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q);
    });
  }, [algorithms, search, selected]);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500">
          <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.513a.75.75 0 0 1-1.08 0l-5.25-5.512a.75.75 0 0 1 1.08-1.04l3.96 4.157V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
        </svg>
        Select Algorithms
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Choose 2 or 3 sorting algorithms to compare side-by-side.
      </p>

      {/* Search / dropdown */}
      <div className="relative mb-4" ref={wrapperRef}>
        <input
          type="text"
          placeholder="Search sorting algorithms..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setDropdownOpen(true);
          }}
          onFocus={() => setDropdownOpen(true)}
          disabled={selected.length >= 3}
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        {dropdownOpen && selected.length < 3 && filtered.length > 0 && (
          <ul className="absolute z-20 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
            {filtered.map((algo) => (
              <li key={algo.slug}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(algo);
                    setSearch('');
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                >
                  <span className="font-medium">{algo.name}</span>
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500 ml-2 shrink-0">
                    O({algo.complexity.time.average.replace(/O\(|\)/g, '')})
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selected.map((algo) => (
            <span
              key={algo.slug}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            >
              {algo.name}
              <button
                type="button"
                onClick={() => onRemove(algo.slug)}
                className="ml-0.5 hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
                aria-label={`Remove ${algo.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Compare button */}
      <button
        onClick={onCompare}
        disabled={loading || selected.length < 2}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2ZM10.5 7A1.5 1.5 0 0 0 9 8.5v8a1.5 1.5 0 0 0 3 0v-8A1.5 1.5 0 0 0 10.5 7ZM5.5 12A1.5 1.5 0 0 0 4 13.5v3a1.5 1.5 0 0 0 3 0v-3A1.5 1.5 0 0 0 5.5 12Z" />
        </svg>
        Compare ({selected.length}/3)
      </button>
    </div>
  );
}

// ── Shared Controls Bar ──────────────────────────────────────────────

function SharedControls({
  isPlaying,
  speed,
  allFinished,
  onPlay,
  onPause,
  onStepForward,
  onReset,
  onRandomize,
  onSpeedChange,
}: {
  isPlaying: boolean;
  speed: number;
  allFinished: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onRandomize: () => void;
  onSpeedChange: (s: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* Play / Pause */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={allFinished && !isPlaying}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white transition-colors"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm10.5 0a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Step Forward */}
        <button
          onClick={onStepForward}
          disabled={allFinished}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40 text-gray-700 dark:text-gray-200 transition-colors"
          title="Step Forward"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            <path d="M19.5 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z" />
          </svg>
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
          title="Reset"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903H14.25a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 .75-.75v-6a.75.75 0 0 0-1.5 0v3.068l-1.658-1.658A9 9 0 0 0 3.366 9.576a.75.75 0 1 0 1.39.483Zm14.49 3.882a7.5 7.5 0 0 1-12.548 3.364l-1.903-1.903H9.75a.75.75 0 0 0 0-1.5h-6a.75.75 0 0 0-.75.75v6a.75.75 0 0 0 1.5 0v-3.068l1.658 1.658A9 9 0 0 0 20.634 14.424a.75.75 0 1 0-1.39-.483Z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Speed */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
            Speed
          </label>
          <input
            type="range"
            min="0.25"
            max="4"
            step="0.25"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-20 sm:w-24 accent-blue-600"
          />
          <span className="text-xs font-mono text-gray-600 dark:text-gray-300 w-8 text-right">
            {speed}x
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Randomize */}
        <button
          onClick={onRandomize}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H4.28a.75.75 0 0 0-.75.75v3.955a.75.75 0 0 0 1.5 0v-2.134l.228.228a7 7 0 0 0 11.711-3.138.75.75 0 0 0-1.458-.356Zm-2.624-5.848a7 7 0 0 0-11.711 3.138.75.75 0 0 0 1.458.356A5.5 5.5 0 0 1 11.89 6.11l.311.31H9.767a.75.75 0 0 0 0 1.5h3.955a.75.75 0 0 0 .75-.75V3.214a.75.75 0 0 0-1.5 0v2.134l-.228-.228Z" clipRule="evenodd" />
          </svg>
          Randomize
        </button>
      </div>
    </div>
  );
}

// ── Comparison Summary Table ─────────────────────────────────────────

function ComparisonTable({ slots }: { slots: AlgorithmSlot[] }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Complexity Comparison
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
              <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Metric</th>
              {slots.map((slot) => (
                <th key={slot.summary.slug} className="text-left px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  {slot.summary.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            <tr>
              <td className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Best Time</td>
              {slots.map((slot) => (
                <td key={slot.summary.slug} className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">
                  {slot.summary.complexity.time.best}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Avg Time</td>
              {slots.map((slot) => (
                <td key={slot.summary.slug} className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">
                  {slot.summary.complexity.time.average}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Worst Time</td>
              {slots.map((slot) => (
                <td key={slot.summary.slug} className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">
                  {slot.summary.complexity.time.worst}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Space</td>
              {slots.map((slot) => (
                <td key={slot.summary.slug} className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">
                  {slot.summary.complexity.space}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Steps Taken</td>
              {slots.map((slot) => (
                <td key={slot.summary.slug} className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">
                  {slot.currentStep} / {slot.totalSteps}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</td>
              {slots.map((slot) => (
                <td key={slot.summary.slug} className="px-4 py-3">
                  {slot.finished ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                      </svg>
                      Complete
                      {slot.finishOrder !== null && (
                        <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">
                          (#{slot.finishOrder})
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                      <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                      Running
                    </span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Compare Page ────────────────────────────────────────────────

export default function Compare() {
  // Algorithm index from server
  const [allAlgorithms, setAllAlgorithms] = useState<AlgorithmSummary[]>([]);
  const [indexLoading, setIndexLoading] = useState(true);

  // Selection phase
  const [selected, setSelected] = useState<AlgorithmSummary[]>([]);

  // Comparison phase
  const [slots, setSlots] = useState<AlgorithmSlot[] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishCountRef = useRef(0);

  // Fetch algorithm index - filter to sorting algorithms with visualizations
  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}data/algorithms-index.json`)
      .then((res) => res.json())
      .then((data: AlgorithmIndex) => {
        if (cancelled) return;
        const sortingWithViz = data.algorithms.filter(
          (a) => a.visualization && SORTING_VIZ_SLUGS.has(a.slug) && hasVisualization(a.slug)
        );
        setAllAlgorithms(sortingWithViz);
        setIndexLoading(false);
      })
      .catch(() => {
        if (!cancelled) setIndexLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Selection handlers ──────────────────────────────────────────────

  const handleSelect = useCallback((algo: AlgorithmSummary) => {
    setSelected((prev) => {
      if (prev.length >= 3) return prev;
      if (prev.some((s) => s.slug === algo.slug)) return prev;
      return [...prev, algo];
    });
  }, []);

  const handleRemove = useCallback((slug: string) => {
    setSelected((prev) => prev.filter((s) => s.slug !== slug));
  }, []);

  // ── Initialize comparison ──────────────────────────────────────────

  const initializeSlots = useCallback(
    (algos: AlgorithmSummary[], arr: number[]): AlgorithmSlot[] => {
      return algos.map((summary) => {
        const engine = getVisualization(summary.slug) as AlgorithmVisualization;
        const state = engine.initialize([...arr]);
        return {
          summary,
          engine,
          state,
          currentStep: 0,
          totalSteps: engine.getStepCount(),
          finished: false,
          finishOrder: null,
        };
      });
    },
    []
  );

  const handleCompare = useCallback(() => {
    if (selected.length < 2) return;
    setIsPlaying(false);
    finishCountRef.current = 0;
    const arr = generateRandomArray();
    const newSlots = initializeSlots(selected, arr);
    setSlots(newSlots);
  }, [selected, initializeSlots]);

  // ── Stepping logic ─────────────────────────────────────────────────

  const stepAll = useCallback(() => {
    setSlots((prev) => {
      if (!prev) return prev;
      let anyAdvanced = false;
      const next = prev.map((slot) => {
        if (slot.finished) return slot;
        const nextState = slot.engine.step();
        if (nextState) {
          anyAdvanced = true;
          const newStep = slot.engine.getCurrentStep();
          const nowFinished = newStep >= slot.totalSteps;
          let finishOrder = slot.finishOrder;
          if (nowFinished && !slot.finished) {
            finishCountRef.current += 1;
            finishOrder = finishCountRef.current;
          }
          return {
            ...slot,
            state: nextState,
            currentStep: newStep,
            finished: nowFinished,
            finishOrder,
          };
        }
        // Engine returned null => finished
        const newFinished = true;
        let finishOrder = slot.finishOrder;
        if (!slot.finished) {
          finishCountRef.current += 1;
          finishOrder = finishCountRef.current;
        }
        return { ...slot, finished: newFinished, finishOrder };
      });
      if (!anyAdvanced) {
        setIsPlaying(false);
      }
      return next;
    });
  }, []);

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    stepAll();
  }, [stepAll]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    if (!slots) return;
    finishCountRef.current = 0;
    // Re-initialize with a fresh copy of the same algorithms and new data
    const arr = generateRandomArray();
    const newSlots = initializeSlots(
      slots.map((s) => s.summary),
      arr
    );
    setSlots(newSlots);
  }, [slots, initializeSlots]);

  const handleRandomize = useCallback(() => {
    setIsPlaying(false);
    if (!slots) return;
    finishCountRef.current = 0;
    const arr = generateRandomArray();
    const newSlots = initializeSlots(
      slots.map((s) => s.summary),
      arr
    );
    setSlots(newSlots);
  }, [slots, initializeSlots]);

  const handleSpeedChange = useCallback((s: number) => {
    setSpeed(s);
  }, []);

  const handleBackToSelect = useCallback(() => {
    setIsPlaying(false);
    setSlots(null);
  }, []);

  // ── Auto-play interval ─────────────────────────────────────────────

  useEffect(() => {
    if (isPlaying && slots) {
      playIntervalRef.current = setInterval(() => {
        stepAll();
      }, 800 / speed);
    }
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    };
  }, [isPlaying, speed, slots, stepAll]);

  // ── Derived state ──────────────────────────────────────────────────

  const allFinished = useMemo(() => {
    if (!slots) return false;
    return slots.every((s) => s.finished);
  }, [slots]);

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Compare Algorithms
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Select 2-3 sorting algorithms and watch them run side-by-side on the same data set. See which finishes first and compare their step counts and complexities.
        </p>
      </div>

      {/* Selection phase */}
      {!slots && (
        <CompareSelector
          algorithms={allAlgorithms}
          selected={selected}
          onSelect={handleSelect}
          onRemove={handleRemove}
          onCompare={handleCompare}
          loading={indexLoading}
        />
      )}

      {/* Comparison phase */}
      {slots && (
        <div className="space-y-6">
          {/* Back button */}
          <button
            onClick={handleBackToSelect}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
            </svg>
            Back to selection
          </button>

          {/* Visualization grid */}
          <div
            className={`grid gap-4 ${
              slots.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {slots.map((slot) => (
              <div
                key={slot.summary.slug}
                className={`rounded-2xl border bg-white dark:bg-gray-900 shadow-sm overflow-hidden ${
                  slot.finished
                    ? slot.finishOrder === 1
                      ? 'border-green-400 dark:border-green-600 ring-2 ring-green-400/30 dark:ring-green-600/30'
                      : 'border-green-300 dark:border-green-700'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Column header */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {slot.summary.name}
                    </h3>
                    <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
                      Avg: {slot.summary.complexity.time.average}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {slot.finished ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                        {slot.finishOrder === 1 ? 'Winner' : `#${slot.finishOrder}`}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                        Running
                      </span>
                    )}
                  </div>
                </div>

                {/* Visualizer */}
                <div className="p-3">
                  <Visualizer state={slot.state} />
                </div>

                {/* Step counter footer */}
                <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      Step {slot.currentStep} / {slot.totalSteps}
                    </span>
                    {/* Progress bar */}
                    <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-200 ${
                          slot.finished
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`}
                        style={{
                          width: `${slot.totalSteps > 0 ? (slot.currentStep / slot.totalSteps) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shared controls */}
          <SharedControls
            isPlaying={isPlaying}
            speed={speed}
            allFinished={allFinished}
            onPlay={handlePlay}
            onPause={handlePause}
            onStepForward={handleStepForward}
            onReset={handleReset}
            onRandomize={handleRandomize}
            onSpeedChange={handleSpeedChange}
          />

          {/* Comparison summary table */}
          <ComparisonTable slots={slots} />
        </div>
      )}
    </div>
  );
}
