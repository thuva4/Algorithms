import { Link } from 'react-router-dom'
import type { AlgorithmSummary } from '../types.ts'

const categoryColors: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  sorting: { bg: 'bg-blue-100', text: 'text-blue-700', darkBg: 'dark:bg-blue-900/40', darkText: 'dark:text-blue-300' },
  searching: { bg: 'bg-green-100', text: 'text-green-700', darkBg: 'dark:bg-green-900/40', darkText: 'dark:text-green-300' },
  graph: { bg: 'bg-purple-100', text: 'text-purple-700', darkBg: 'dark:bg-purple-900/40', darkText: 'dark:text-purple-300' },
  'dynamic-programming': { bg: 'bg-orange-100', text: 'text-orange-700', darkBg: 'dark:bg-orange-900/40', darkText: 'dark:text-orange-300' },
  trees: { bg: 'bg-teal-100', text: 'text-teal-700', darkBg: 'dark:bg-teal-900/40', darkText: 'dark:text-teal-300' },
  strings: { bg: 'bg-pink-100', text: 'text-pink-700', darkBg: 'dark:bg-pink-900/40', darkText: 'dark:text-pink-300' },
  math: { bg: 'bg-amber-100', text: 'text-amber-700', darkBg: 'dark:bg-amber-900/40', darkText: 'dark:text-amber-300' },
  greedy: { bg: 'bg-lime-100', text: 'text-lime-700', darkBg: 'dark:bg-lime-900/40', darkText: 'dark:text-lime-300' },
  backtracking: { bg: 'bg-rose-100', text: 'text-rose-700', darkBg: 'dark:bg-rose-900/40', darkText: 'dark:text-rose-300' },
  'divide-and-conquer': { bg: 'bg-indigo-100', text: 'text-indigo-700', darkBg: 'dark:bg-indigo-900/40', darkText: 'dark:text-indigo-300' },
  'bit-manipulation': { bg: 'bg-cyan-100', text: 'text-cyan-700', darkBg: 'dark:bg-cyan-900/40', darkText: 'dark:text-cyan-300' },
  cryptography: { bg: 'bg-violet-100', text: 'text-violet-700', darkBg: 'dark:bg-violet-900/40', darkText: 'dark:text-violet-300' },
  'data-structures': { bg: 'bg-emerald-100', text: 'text-emerald-700', darkBg: 'dark:bg-emerald-900/40', darkText: 'dark:text-emerald-300' },
}

const difficultyColors: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  beginner: { bg: 'bg-green-100', text: 'text-green-700', darkBg: 'dark:bg-green-900/40', darkText: 'dark:text-green-300' },
  intermediate: { bg: 'bg-yellow-100', text: 'text-yellow-700', darkBg: 'dark:bg-yellow-900/40', darkText: 'dark:text-yellow-300' },
  advanced: { bg: 'bg-red-100', text: 'text-red-700', darkBg: 'dark:bg-red-900/40', darkText: 'dark:text-red-300' },
}

function formatCategory(category: string): string {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

interface AlgorithmCardProps {
  algorithm: AlgorithmSummary
}

export default function AlgorithmCard({ algorithm }: AlgorithmCardProps) {
  const catColor = categoryColors[algorithm.category] ?? {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    darkBg: 'dark:bg-gray-800',
    darkText: 'dark:text-gray-300',
  }

  const diffColor = difficultyColors[algorithm.difficulty] ?? difficultyColors.beginner

  return (
    <Link
      to={`/algorithm/${algorithm.category}/${algorithm.slug}`}
      className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {algorithm.name}
        </h3>
        {algorithm.visualization && (
          <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500" title="Visualization available">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
            </svg>
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${catColor.bg} ${catColor.text} ${catColor.darkBg} ${catColor.darkText}`}
        >
          {formatCategory(algorithm.category)}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${diffColor.bg} ${diffColor.text} ${diffColor.darkBg} ${diffColor.darkText}`}
        >
          {algorithm.difficulty}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span className="font-mono text-xs" title="Average time complexity">
          {algorithm.complexity.time.average}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
          </svg>
          {algorithm.languageCount} {algorithm.languageCount === 1 ? 'language' : 'languages'}
        </span>
      </div>
    </Link>
  )
}
