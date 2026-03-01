import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  population: '#3b82f6',
  best: '#22c55e',
  parent: '#eab308',
  offspring: '#a855f7',
  mutation: '#ef4444',
};

export class GeneticAlgorithmVisualization implements AlgorithmVisualization {
  name = 'Genetic Algorithm';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Simple GA: maximize f(x) = x * sin(x/10) + x for x in [0, 100]
    // Chromosome = integer value, fitness = f(x)
    const popSize = Math.min(Math.max(data[0] || 8, 4), 10);
    const generations = Math.min(Math.max(data[1] || 5, 2), 8);

    const fitness = (x: number): number => {
      const clamped = Math.max(0, Math.min(100, x));
      return clamped * Math.sin(clamped / 10) + clamped;
    };

    // Seed random
    let seed = (data[2] || 42) + data.reduce((a, b) => a + Math.abs(b), 0);
    const rand = (): number => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    // Initialize random population
    let population: number[] = [];
    for (let i = 0; i < popSize; i++) {
      population.push(Math.floor(rand() * 100));
    }

    const fitnesses = population.map(fitness);
    const bestIdx = fitnesses.indexOf(Math.max(...fitnesses));

    this.steps.push({
      data: [...population],
      highlights: population.map((v, i) => ({
        index: i,
        color: i === bestIdx ? COLORS.best : COLORS.population,
        label: `f(${v})=${fitness(v).toFixed(1)}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Genetic Algorithm: population of ${popSize}, ${generations} generations. Maximize f(x) = x*sin(x/10)+x. Best: f(${population[bestIdx]})=${fitness(population[bestIdx]).toFixed(1)}`,
    });

    for (let gen = 0; gen < generations; gen++) {
      // Selection: tournament selection (pick 2, keep better)
      const parents: number[] = [];

      this.steps.push({
        data: [...population],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Generation ${gen + 1}: Selection phase - tournament selection`,
      });

      for (let i = 0; i < popSize; i++) {
        const a = Math.floor(rand() * popSize);
        const b = Math.floor(rand() * popSize);
        const winner = fitness(population[a]) >= fitness(population[b]) ? a : b;
        parents.push(population[winner]);

        this.steps.push({
          data: [...population],
          highlights: [
            { index: a, color: COLORS.parent, label: `f=${fitness(population[a]).toFixed(0)}` },
            { index: b, color: COLORS.parent, label: `f=${fitness(population[b]).toFixed(0)}` },
          ],
          comparisons: [[a, b]],
          swaps: [],
          sorted: [],
          stepDescription: `Tournament: ${population[a]} (f=${fitness(population[a]).toFixed(1)}) vs ${population[b]} (f=${fitness(population[b]).toFixed(1)}) -> winner: ${population[winner]}`,
        });
      }

      // Crossover: single-point crossover on pairs
      const offspring: number[] = [];

      this.steps.push({
        data: [...parents],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Generation ${gen + 1}: Crossover phase`,
      });

      for (let i = 0; i < popSize - 1; i += 2) {
        const p1 = parents[i];
        const p2 = parents[i + 1];

        // Arithmetic crossover: child = alpha*p1 + (1-alpha)*p2
        const alpha = rand();
        const c1 = Math.floor(alpha * p1 + (1 - alpha) * p2);
        const c2 = Math.floor((1 - alpha) * p1 + alpha * p2);

        offspring.push(c1, c2);

        this.steps.push({
          data: [...offspring, ...new Array(Math.max(0, popSize - offspring.length)).fill(0)],
          highlights: [
            { index: offspring.length - 2, color: COLORS.offspring, label: `c1=${c1}` },
            { index: offspring.length - 1, color: COLORS.offspring, label: `c2=${c2}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Crossover: parents (${p1}, ${p2}), alpha=${alpha.toFixed(2)} -> offspring (${c1}, ${c2})`,
        });
      }

      if (offspring.length < popSize) {
        offspring.push(parents[popSize - 1]);
      }

      // Mutation: small random perturbation with probability 0.3
      this.steps.push({
        data: [...offspring],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Generation ${gen + 1}: Mutation phase (rate=30%)`,
      });

      for (let i = 0; i < offspring.length; i++) {
        if (rand() < 0.3) {
          const oldVal = offspring[i];
          const delta = Math.floor((rand() - 0.5) * 20);
          offspring[i] = Math.max(0, Math.min(100, offspring[i] + delta));

          this.steps.push({
            data: [...offspring],
            highlights: [
              { index: i, color: COLORS.mutation, label: `${oldVal}->${offspring[i]}` },
            ],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Mutation at ${i}: ${oldVal} + ${delta} = ${offspring[i]}`,
          });
        }
      }

      // Elitism: keep best from previous generation
      const prevBestIdx = population.map(fitness).indexOf(Math.max(...population.map(fitness)));
      const worstNewIdx = offspring.map(fitness).indexOf(Math.min(...offspring.map(fitness)));
      if (fitness(population[prevBestIdx]) > fitness(offspring[worstNewIdx])) {
        offspring[worstNewIdx] = population[prevBestIdx];
      }

      population = [...offspring];

      const newFitnesses = population.map(fitness);
      const newBestIdx = newFitnesses.indexOf(Math.max(...newFitnesses));

      this.steps.push({
        data: [...population],
        highlights: population.map((v, i) => ({
          index: i,
          color: i === newBestIdx ? COLORS.best : COLORS.population,
          label: `f(${v})=${fitness(v).toFixed(0)}`,
        })),
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Gen ${gen + 1} complete. Best: f(${population[newBestIdx]}) = ${fitness(population[newBestIdx]).toFixed(1)}. Pop: [${population.join(', ')}]`,
      });
    }

    // Final result
    const finalFitnesses = population.map(fitness);
    const finalBestIdx = finalFitnesses.indexOf(Math.max(...finalFitnesses));

    this.steps.push({
      data: [...population],
      highlights: [
        { index: finalBestIdx, color: COLORS.best, label: `BEST: x=${population[finalBestIdx]}, f=${fitness(population[finalBestIdx]).toFixed(1)}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [finalBestIdx],
      stepDescription: `GA complete! Best solution: x=${population[finalBestIdx]}, f(x)=${fitness(population[finalBestIdx]).toFixed(2)} after ${generations} generations`,
    });

    return this.steps[0];
  }

  step(): VisualizationState | null {
    this.currentStepIndex++;
    if (this.currentStepIndex >= this.steps.length) {
      this.currentStepIndex = this.steps.length;
      return null;
    }
    return this.steps[this.currentStepIndex];
  }

  reset(): void {
    this.currentStepIndex = -1;
  }

  getStepCount(): number {
    return this.steps.length;
  }

  getCurrentStep(): number {
    return this.currentStepIndex;
  }
}
