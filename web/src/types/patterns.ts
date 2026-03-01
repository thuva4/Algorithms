export type PatternDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface PatternAlgorithmReference {
  slug: string
  name: string
  category: string
  difficulty: PatternDifficulty
  patternDifficulty: PatternDifficulty
  complexity?: {
    time?: string
    space?: string
  }
  practiceOrder?: number
}

export interface PatternData {
  name: string
  slug: string
  category: string
  difficulty: PatternDifficulty
  timeComplexity: string
  spaceComplexity: string
  recognitionTips: string[]
  commonVariations: string[]
  relatedPatterns: string[]
  keywords: string[]
  estimatedTime: string
  algorithmCount: number
  algorithms: PatternAlgorithmReference[]
  content: string
}

export interface PatternIndexData {
  patterns: PatternData[]
}
