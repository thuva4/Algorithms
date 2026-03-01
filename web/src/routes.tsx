import type { ComponentType } from 'react'
import AlgorithmDetail from './pages/AlgorithmDetail'
import Compare from './pages/Compare'
import Home from './pages/Home'
import LearningPaths from './pages/LearningPaths'
import PatternDetail from './pages/PatternDetail'

// Keep route paths and navigation labels together so the router and header stay in sync.
export const routePaths = {
  home: '/',
  algorithmDetail: '/algorithm/:category/:slug',
  compare: '/compare',
  learningPaths: '/learn',
  patternDetail: '/patterns/:slug',
} as const

type AppRouteDefinition = {
  path: string
  Component: ComponentType
}

type PrimaryNavigationItem = {
  label: string
  to: string
  end?: boolean
}

export const appRoutes: AppRouteDefinition[] = [
  { path: routePaths.home, Component: Home },
  { path: routePaths.algorithmDetail, Component: AlgorithmDetail },
  { path: routePaths.compare, Component: Compare },
  { path: routePaths.learningPaths, Component: LearningPaths },
  { path: routePaths.patternDetail, Component: PatternDetail },
]

export const primaryNavigation: PrimaryNavigationItem[] = [
  { label: 'Explorer', to: routePaths.home, end: true },
  { label: 'Compare', to: routePaths.compare },
  { label: 'Learn', to: routePaths.learningPaths },
]
