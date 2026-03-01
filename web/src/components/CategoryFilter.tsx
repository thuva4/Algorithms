interface CategoryFilterProps {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
}

function formatCategory(category: string): string {
  if (category === 'all') return 'All'
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      <button
        onClick={() => onSelect('all')}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          selected === 'all'
            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selected === category
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          {formatCategory(category)}
        </button>
      ))}
    </div>
  )
}
