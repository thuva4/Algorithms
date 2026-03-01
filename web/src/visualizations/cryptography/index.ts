import type { AlgorithmVisualization } from '../types';
import { AesSimplifiedVisualization } from './aesSimplified';
import { DiffieHellmanVisualization } from './diffieHellman';
import { PearsonHashingVisualization } from './pearsonHashing';
import { RsaAlgorithmVisualization } from './rsaAlgorithm';

export const cryptographyVisualizations: Record<string, () => AlgorithmVisualization> = {
  'aes-simplified': () => new AesSimplifiedVisualization(),
  'diffie-hellman': () => new DiffieHellmanVisualization(),
  'pearson-hashing': () => new PearsonHashingVisualization(),
  'rsa-algorithm': () => new RsaAlgorithmVisualization(),
};
