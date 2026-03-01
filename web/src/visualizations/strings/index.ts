import type { StringVisualizationEngine } from '../types';
import { KMPVisualization } from './kmp';
import { RabinKarpVisualization } from './rabinKarp';
import { AhoCorasickVisualization } from './ahoCorasick';
import { BitapAlgorithmVisualization } from './bitapAlgorithm';
import { BoyerMooreVisualization } from './boyerMoore';
import { LevenshteinDistanceVisualization } from './levenshteinDistance';
import { LongestPalindromicSubstringVisualization } from './longestPalindromicSubstring';
import { LZ77CompressionVisualization } from './lz77Compression';
import { ManachersAlgorithmVisualization } from './manachersAlgorithm';
import { RobinKarpRollingHashVisualization } from './robinKarpRollingHash';
import { RunLengthEncodingVisualization } from './runLengthEncoding';
import { StringToTokenVisualization } from './stringToToken';
import { SuffixArrayVisualization } from './suffixArray';
import { SuffixTreeVisualization } from './suffixTree';
import { ZAlgorithmVisualization } from './zAlgorithm';

export const stringVisualizations: Record<string, () => StringVisualizationEngine> = {
  'knuth-morris-pratt': () => new KMPVisualization(),
  'rabin-karp': () => new RabinKarpVisualization(),
  'aho-corasick': () => new AhoCorasickVisualization(),
  'bitap-algorithm': () => new BitapAlgorithmVisualization(),
  'boyer-moore': () => new BoyerMooreVisualization(),
  'levenshtein-distance': () => new LevenshteinDistanceVisualization(),
  'longest-palindromic-substring': () => new LongestPalindromicSubstringVisualization(),
  'lz77-compression': () => new LZ77CompressionVisualization(),
  'manachers-algorithm': () => new ManachersAlgorithmVisualization(),
  'robin-karp-rolling-hash': () => new RobinKarpRollingHashVisualization(),
  'run-length-encoding': () => new RunLengthEncodingVisualization(),
  'string-to-token': () => new StringToTokenVisualization(),
  'suffix-array': () => new SuffixArrayVisualization(),
  'suffix-tree': () => new SuffixTreeVisualization(),
  'z-algorithm': () => new ZAlgorithmVisualization(),
};

export {
  KMPVisualization,
  RabinKarpVisualization,
  AhoCorasickVisualization,
  BitapAlgorithmVisualization,
  BoyerMooreVisualization,
  LevenshteinDistanceVisualization,
  LongestPalindromicSubstringVisualization,
  LZ77CompressionVisualization,
  ManachersAlgorithmVisualization,
  RobinKarpRollingHashVisualization,
  RunLengthEncodingVisualization,
  StringToTokenVisualization,
  SuffixArrayVisualization,
  SuffixTreeVisualization,
  ZAlgorithmVisualization,
};
