import { useState, useEffect } from 'react'
import type { AlgorithmIndex, AlgorithmSummary } from '../types.ts'

interface UseAlgorithmsResult {
  algorithms: AlgorithmSummary[]
  totalAlgorithms: number
  totalImplementations: number
  loading: boolean
  error: string | null
}

export function useAlgorithms(): UseAlgorithmsResult {
  const [algorithms, setAlgorithms] = useState<AlgorithmSummary[]>([])
  const [totalAlgorithms, setTotalAlgorithms] = useState(0)
  const [totalImplementations, setTotalImplementations] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchAlgorithms() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/algorithms-index.json`)
        if (!response.ok) {
          throw new Error(`Failed to fetch algorithms: ${response.statusText}`)
        }
        const data: AlgorithmIndex = await response.json()

        if (!cancelled) {
          setAlgorithms(data.algorithms)
          setTotalAlgorithms(data.totalAlgorithms)
          setTotalImplementations(data.totalImplementations)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred')
          setLoading(false)
        }
      }
    }

    fetchAlgorithms()

    return () => {
      cancelled = true
    }
  }, [])

  return { algorithms, totalAlgorithms, totalImplementations, loading, error }
}
