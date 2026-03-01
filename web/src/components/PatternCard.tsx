import { Link } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import type { PatternData } from '../types/patterns'

const difficultyClasses: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

interface PatternCardProps {
  pattern: PatternData
}

export default function PatternCard({ pattern }: PatternCardProps) {
  const { getPatternProgress } = useProgress()
  const progress = getPatternProgress(pattern.slug, pattern.algorithmCount)

  return (
    <Link
      to={`/patterns/${pattern.slug}`}
      className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{pattern.name}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
            difficultyClasses[pattern.difficulty] ?? difficultyClasses.beginner
          }`}
        >
          {pattern.difficulty}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        {pattern.algorithmCount} algorithms • {pattern.estimatedTime}
      </p>

      <ul className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
        {pattern.recognitionTips.slice(0, 2).map((tip) => (
          <li key={tip} className="line-clamp-1">
            • {tip}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {progress.completed} / {progress.total} complete
          </span>
          <span>{progress.pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-blue-600 transition-all dark:bg-blue-400"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
      </div>
    </Link>
  )
}
