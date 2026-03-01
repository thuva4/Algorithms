import type { AlgorithmVisualization } from '../types';
import { BinaryGcdVisualization } from './binaryGcd';
import { BorweinsAlgorithmVisualization } from './borweinsAlgorithm';
import { CatalanNumbersVisualization } from './catalanNumbers';
import { ChineseRemainderTheoremVisualization } from './chineseRemainderTheorem';
import { CombinationVisualization } from './combination';
import { ConjugateGradientVisualization } from './conjugateGradient';
import { DiscreteLogarithmVisualization } from './discreteLogarithm';
import { DoomsdayVisualization } from './doomsday';
import { EulerTotientVisualization } from './eulerTotient';
import { EulerTotientSieveVisualization } from './eulerTotientSieve';
import { ExtendedEuclideanVisualization } from './extendedEuclidean';
import { ExtendedGcdApplicationsVisualization } from './extendedGcdApplications';
import { FactorialVisualization } from './factorial';
import { FastFourierTransformVisualization } from './fastFourierTransform';
import { FisherYatesShuffleVisualization } from './fisherYatesShuffle';
import { GaussianEliminationVisualization } from './gaussianElimination';
import { GeneticAlgorithmVisualization } from './geneticAlgorithm';
import { GreatestCommonDivisorVisualization } from './greatestCommonDivisor';
import { HistogramEqualizationVisualization } from './histogramEqualization';
import { InverseFastFourierTransformVisualization } from './inverseFastFourierTransform';
import { JosephusProblemVisualization } from './josephusProblem';
import { LucasTheoremVisualization } from './lucasTheorem';
import { LuhnVisualization } from './luhn';
import { MatrixDeterminantVisualization } from './matrixDeterminant';
import { MatrixExponentiationVisualization } from './matrixExponentiation';
import { MillerRabinVisualization } from './millerRabin';
import { MobiusFunctionVisualization } from './mobiusFunction';
import { ModularExponentiationVisualization } from './modularExponentiation';
import { NewtonsMethodVisualization } from './newtonsMethod';
import { NttVisualization } from './ntt';
import { PollardsRhoVisualization } from './pollardsRho';
import { PrimalityTestsVisualization } from './primalityTests';
import { PrimeCheckVisualization } from './primeCheck';
import { ReservoirSamplingVisualization } from './reservoirSampling';
import { SegmentedSieveVisualization } from './segmentedSieve';
import { SieveOfEratosthenesVisualization } from './sieveOfEratosthenes';
import { SimulatedAnnealingVisualization } from './simulatedAnnealing';
import { SumsetVisualization } from './sumset';
import { SwapTwoVariablesVisualization } from './swapTwoVariables';
import { VegasAlgorithmVisualization } from './vegasAlgorithm';

export const mathVisualizations: Record<string, () => AlgorithmVisualization> = {
  'binary-gcd': () => new BinaryGcdVisualization(),
  'borweins-algorithm': () => new BorweinsAlgorithmVisualization(),
  'catalan-numbers': () => new CatalanNumbersVisualization(),
  'chinese-remainder-theorem': () => new ChineseRemainderTheoremVisualization(),
  'combination': () => new CombinationVisualization(),
  'conjugate-gradient': () => new ConjugateGradientVisualization(),
  'discrete-logarithm': () => new DiscreteLogarithmVisualization(),
  'doomsday': () => new DoomsdayVisualization(),
  'euler-toient': () => new EulerTotientVisualization(),
  'euler-totient-sieve': () => new EulerTotientSieveVisualization(),
  'extended-euclidean': () => new ExtendedEuclideanVisualization(),
  'extended-gcd-applications': () => new ExtendedGcdApplicationsVisualization(),
  'factorial': () => new FactorialVisualization(),
  'fast-fourier-transform': () => new FastFourierTransformVisualization(),
  'fisher-yates-shuffle': () => new FisherYatesShuffleVisualization(),
  'gaussian-elimination': () => new GaussianEliminationVisualization(),
  'genetic-algorithm': () => new GeneticAlgorithmVisualization(),
  'greatest-common-divisor': () => new GreatestCommonDivisorVisualization(),
  'histogram-equalization': () => new HistogramEqualizationVisualization(),
  'inverse-fast-fourier-transform': () => new InverseFastFourierTransformVisualization(),
  'josephus-problem': () => new JosephusProblemVisualization(),
  'lucas-theorem': () => new LucasTheoremVisualization(),
  'luhn': () => new LuhnVisualization(),
  'matrix-determinant': () => new MatrixDeterminantVisualization(),
  'matrix-exponentiation': () => new MatrixExponentiationVisualization(),
  'miller-rabin': () => new MillerRabinVisualization(),
  'mobius-function': () => new MobiusFunctionVisualization(),
  'modular-exponentiation': () => new ModularExponentiationVisualization(),
  'newtons-method': () => new NewtonsMethodVisualization(),
  'ntt': () => new NttVisualization(),
  'pollards-rho': () => new PollardsRhoVisualization(),
  'primality-tests': () => new PrimalityTestsVisualization(),
  'prime-check': () => new PrimeCheckVisualization(),
  'reservoir-sampling': () => new ReservoirSamplingVisualization(),
  'segmented-sieve': () => new SegmentedSieveVisualization(),
  'sieve-of-eratosthenes': () => new SieveOfEratosthenesVisualization(),
  'simulated-annealing': () => new SimulatedAnnealingVisualization(),
  'sumset': () => new SumsetVisualization(),
  'swap-two-variables': () => new SwapTwoVariablesVisualization(),
  'vegas-algorithm': () => new VegasAlgorithmVisualization(),
};

export {
  BinaryGcdVisualization,
  BorweinsAlgorithmVisualization,
  CatalanNumbersVisualization,
  ChineseRemainderTheoremVisualization,
  CombinationVisualization,
  ConjugateGradientVisualization,
  DiscreteLogarithmVisualization,
  DoomsdayVisualization,
  EulerTotientVisualization,
  EulerTotientSieveVisualization,
  ExtendedEuclideanVisualization,
  ExtendedGcdApplicationsVisualization,
  FactorialVisualization,
  FastFourierTransformVisualization,
  FisherYatesShuffleVisualization,
  GaussianEliminationVisualization,
  GeneticAlgorithmVisualization,
  GreatestCommonDivisorVisualization,
  HistogramEqualizationVisualization,
  InverseFastFourierTransformVisualization,
  JosephusProblemVisualization,
  LucasTheoremVisualization,
  LuhnVisualization,
  MatrixDeterminantVisualization,
  MatrixExponentiationVisualization,
  MillerRabinVisualization,
  MobiusFunctionVisualization,
  ModularExponentiationVisualization,
  NewtonsMethodVisualization,
  NttVisualization,
  PollardsRhoVisualization,
  PrimalityTestsVisualization,
  PrimeCheckVisualization,
  ReservoirSamplingVisualization,
  SegmentedSieveVisualization,
  SieveOfEratosthenesVisualization,
  SimulatedAnnealingVisualization,
  SumsetVisualization,
  SwapTwoVariablesVisualization,
  VegasAlgorithmVisualization,
};
