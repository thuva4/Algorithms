import { createContext } from 'react'

export interface ProgressContextValue {
  isCompleted: (patternSlug: string, algorithmSlug: string) => boolean
  toggleCompleted: (patternSlug: string, algorithmSlug: string) => void
  getPatternProgress: (
    patternSlug: string,
    total: number
  ) => { completed: number; total: number; pct: number }
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)
