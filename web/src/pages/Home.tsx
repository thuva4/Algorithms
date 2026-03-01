import { useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAlgorithms } from '../hooks/useAlgorithms.ts'
import AlgorithmCard from '../components/AlgorithmCard.tsx'
import CategoryFilter from '../components/CategoryFilter.tsx'
import SearchBar from '../components/SearchBar.tsx'

export default function Home() {
  const { algorithms, totalAlgorithms, totalImplementations, loading, error } = useAlgorithms()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category') ?? 'all'
  const searchQuery = searchParams.get('q') ?? searchParams.get('tag') ?? ''

  const handleCategorySelect = useCallback((category: string) => {
    const next = new URLSearchParams(searchParams)
    if (category === 'all') {
      next.delete('category')
    } else {
      next.set('category', category)
    }
    setSearchParams(next)
  }, [searchParams, setSearchParams])

  const handleSearchChange = useCallback((query: string) => {
    const next = new URLSearchParams(searchParams)
    const trimmedQuery = query.trim()
    if (trimmedQuery) {
      next.set('q', query)
    } else {
      next.delete('q')
    }
    next.delete('tag')
    setSearchParams(next)
  }, [searchParams, setSearchParams])

  const handleClearFilters = useCallback(() => {
    setSearchParams({})
  }, [setSearchParams])

  const categories = useMemo(() => {
    const cats = new Set<string>()
    for (const algo of algorithms) {
      cats.add(algo.category)
    }
    return Array.from(cats).sort()
  }, [algorithms])

  const filteredAlgorithms = useMemo(() => {
    let result = algorithms

    if (selectedCategory !== 'all') {
      result = result.filter((a) => a.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query) ||
          a.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return result
  }, [algorithms, selectedCategory, searchQuery])

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
          <p className="text-red-600 dark:text-red-400">Failed to load algorithms: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Algorithm Explorer</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Browse, visualize, and learn algorithms implemented in 11 programming languages.
        </p>

        {!loading && (
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalAlgorithms}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Algorithms</p>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-800" />
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalImplementations}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Implementations</p>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-800" />
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">11</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Languages</p>
            </div>
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <SearchBar value={searchQuery} onChange={handleSearchChange} />
        {!loading && (
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={handleCategorySelect}
          />
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="mt-3 flex gap-2">
                <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="mt-4 flex justify-between">
                <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && filteredAlgorithms.length > 0 && (
        <>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredAlgorithms.length} of {totalAlgorithms} algorithms
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAlgorithms.map((algorithm) => (
              <AlgorithmCard key={algorithm.slug} algorithm={algorithm} />
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && filteredAlgorithms.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center dark:border-gray-800 dark:bg-gray-900">
          <svg
            className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No algorithms found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter to find what you are looking for.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-4 inline-flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
