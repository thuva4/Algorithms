import { useCallback, useState, type ReactNode } from 'react'
import { ProgressContext } from './progress-context'

export type ProgressState = Record<string, Record<string, boolean>>

const STORAGE_KEY = 'algorithm-progress'

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function loadProgress(): ProgressState {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {}
    }

    const parsed: unknown = JSON.parse(raw)
    if (!isObjectRecord(parsed)) {
      return {}
    }

    const normalized: ProgressState = {}
    for (const [patternSlug, algorithms] of Object.entries(parsed)) {
      if (!isObjectRecord(algorithms)) {
        continue
      }

      normalized[patternSlug] = {}
      for (const [algorithmSlug, completed] of Object.entries(algorithms)) {
        normalized[patternSlug][algorithmSlug] = Boolean(completed)
      }
    }
    return normalized
  } catch {
    return {}
  }
}

function saveProgress(state: ProgressState): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(loadProgress)

  const isCompleted = useCallback(
    (patternSlug: string, algorithmSlug: string) =>
      Boolean(progress[patternSlug]?.[algorithmSlug]),
    [progress]
  )

  const toggleCompleted = useCallback((patternSlug: string, algorithmSlug: string) => {
    setProgress((prev) => {
      const patternProgress = prev[patternSlug] ?? {}
      const updated: ProgressState = {
        ...prev,
        [patternSlug]: {
          ...patternProgress,
          [algorithmSlug]: !patternProgress[algorithmSlug],
        },
      }
      saveProgress(updated)
      return updated
    })
  }, [])

  const getPatternProgress = useCallback(
    (patternSlug: string, total: number) => {
      const patternProgress = progress[patternSlug] ?? {}
      const completed = Object.values(patternProgress).filter(Boolean).length
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0
      return { completed, total, pct }
    },
    [progress]
  )

  return (
    <ProgressContext.Provider value={{ isCompleted, toggleCompleted, getPatternProgress }}>
      {children}
    </ProgressContext.Provider>
  )
}
