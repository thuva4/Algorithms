import { useProgress } from '../hooks/useProgress'

interface AlgorithmProgressTrackerProps {
  patternSlug: string
  algorithmSlug: string
}

export default function AlgorithmProgressTracker({
  patternSlug,
  algorithmSlug,
}: AlgorithmProgressTrackerProps) {
  const { isCompleted, toggleCompleted } = useProgress()
  const completed = isCompleted(patternSlug, algorithmSlug)

  return (
    <label className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-blue-500 hover:text-blue-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-300">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
        checked={completed}
        onChange={() => toggleCompleted(patternSlug, algorithmSlug)}
      />
      <span
        className={
          completed
            ? 'text-green-700 dark:text-green-300'
            : 'text-gray-600 group-hover:text-blue-700 dark:text-gray-400 dark:group-hover:text-blue-300'
        }
      >
        {completed ? 'Completed' : 'Mark done'}
      </span>
    </label>
  )
}
