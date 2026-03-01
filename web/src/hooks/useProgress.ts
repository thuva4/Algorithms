import { useContext } from 'react'
import { ProgressContext, type ProgressContextValue } from '../context/progress-context'

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider')
  }
  return context
}
