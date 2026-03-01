export interface PatternFrontmatter {
  name: string;
  slug: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeComplexity: string;
  spaceComplexity: string;
  recognitionTips: string[];
  commonVariations: string[];
  relatedPatterns: string[];
  keywords: string[];
  estimatedTime: string;
  algorithmCount?: number;
}

export interface AlgorithmMetadata {
  name: string;
  slug: string;
  category: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  patterns?: string[];
  patternDifficulty?: 'beginner' | 'intermediate' | 'advanced';
  interviewFrequency?: 'low' | 'medium' | 'high';
  practiceOrder?: number;
  complexity?: {
    time?: {
      best?: string;
      average?: string;
      worst?: string;
    };
    space?: string;
  };
}

export interface AlgorithmReference {
  slug: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  patternDifficulty: 'beginner' | 'intermediate' | 'advanced';
  complexity?: {
    time?: string;
    space?: string;
  };
  practiceOrder?: number;
}

export interface Pattern {
  slug: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeComplexity: string;
  spaceComplexity: string;
  recognitionTips: string[];
  commonVariations: string[];
  relatedPatterns: string[];
  keywords: string[];
  estimatedTime: string;
  algorithmCount: number;
  algorithms: AlgorithmReference[];
  content: string; // Rendered HTML
}

export interface PatternsIndex {
  patterns: Pattern[];
  lastUpdated: string;
}

export interface ValidationError {
  type: 'error' | 'warning';
  file: string;
  message: string;
}
