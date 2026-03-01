export interface Complexity {
  time: {
    best: string
    average: string
    worst: string
  }
  space: string
}

export interface AlgorithmSummary {
  name: string
  slug: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  complexity: Complexity
  languageCount: number
  languages: string[]
  visualization: boolean
}

export interface AlgorithmIndex {
  totalAlgorithms: number
  totalImplementations: number
  algorithms: AlgorithmSummary[]
}

export interface Implementation {
  language: string
  fileName: string
  code: string
}

export interface ImplementationFile {
  filename: string
  content: string
}

export interface ImplementationEntry {
  display: string
  files: ImplementationFile[]
}

export interface AlgorithmDetailData {
  name: string
  slug: string
  category: string
  subcategory?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  complexity: Complexity
  stable?: boolean
  in_place?: boolean
  related?: string[]
  implementations: Record<string, ImplementationEntry>
  visualization: boolean
  readme: string
}

// Keep the old interface for backward compat
export interface AlgorithmDetail {
  name: string
  slug: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  complexity: Complexity
  description: string
  implementations: Implementation[]
  visualization: boolean
}
