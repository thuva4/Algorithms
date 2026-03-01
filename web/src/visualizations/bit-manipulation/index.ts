import type { AlgorithmVisualization } from '../types';
import { BitReversalVisualization } from './bitReversal';
import { CountSetBitsVisualization } from './countSetBits';
import { HammingDistanceVisualization } from './hammingDistance';
import { PowerOfTwoCheckVisualization } from './powerOfTwoCheck';
import { UnaryCodingVisualization } from './unaryCoding';
import { XorSwapVisualization } from './xorSwap';

export const bitManipulationVisualizations: Record<string, () => AlgorithmVisualization> = {
  'bit-reversal': () => new BitReversalVisualization(),
  'count-set-bits': () => new CountSetBitsVisualization(),
  'hamming-distance': () => new HammingDistanceVisualization(),
  'power-of-two-check': () => new PowerOfTwoCheckVisualization(),
  'unary-coding': () => new UnaryCodingVisualization(),
  'xor-swap': () => new XorSwapVisualization(),
};
