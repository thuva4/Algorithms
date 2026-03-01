# Genetic Algorithm

## Overview

A Genetic Algorithm (GA) is an evolutionary metaheuristic inspired by natural selection. It maintains a population of candidate solutions that evolve through selection, crossover (recombination), and mutation operations. Over generations, the population converges toward optimal or near-optimal solutions. Genetic algorithms are particularly effective for optimization problems where the search space is large, complex, or poorly understood, and where traditional gradient-based methods are impractical.

For testing purposes, this simplified implementation finds the minimum value in an array using GA-like exploration with a fixed seed for deterministic results.

## How It Works

1. **Initialization:** Create an initial population of random candidate solutions (individuals). Each individual encodes a potential solution as a chromosome (e.g., a binary string, integer array, or real-valued vector).
2. **Fitness Evaluation:** Evaluate each individual using a fitness function that quantifies solution quality (lower is better for minimization; higher is better for maximization).
3. **Selection:** Select parents for reproduction using a strategy that favors fitter individuals. Common methods include tournament selection, roulette-wheel selection, and rank-based selection.
4. **Crossover:** Combine pairs of parents to produce offspring. Common operators include single-point crossover, two-point crossover, and uniform crossover.
5. **Mutation:** Randomly alter some genes in offspring with a small probability (mutation rate), introducing diversity and preventing premature convergence.
6. **Replacement:** Form the new generation from offspring (and optionally some elite individuals from the current generation).
7. **Repeat** steps 2-6 for a fixed number of generations or until a convergence criterion is met.
8. Return the best solution found across all generations.

## Example

**Problem:** Find the minimum value in the array `[14, 7, 23, 2, 18, 11, 5, 30]`.

**Setup:** Population size = 4, Generations = 3, Mutation rate = 0.1

| Generation | Population (indices) | Fitness (values) | Best |
|------------|---------------------|-------------------|------|
| 0 (init)   | [0, 3, 5, 7]       | [14, 2, 11, 30]  | 2    |
| 1           | [3, 6, 1, 3]       | [2, 5, 7, 2]     | 2    |
| 2           | [3, 3, 6, 1]       | [2, 2, 5, 7]     | 2    |
| 3           | [3, 3, 3, 6]       | [2, 2, 2, 5]     | 2    |

The population converges toward index 3 (value 2), the minimum element.

## Pseudocode

```
function geneticAlgorithm(array, popSize, generations, mutationRate):
    n = length(array)

    // Initialize population with random indices
    population = array of popSize random integers in [0, n-1]

    bestSolution = population[0]
    bestFitness = array[population[0]]

    for gen from 1 to generations:
        // Evaluate fitness
        fitness = [array[individual] for individual in population]

        // Track best
        for i from 0 to popSize - 1:
            if fitness[i] < bestFitness:
                bestFitness = fitness[i]
                bestSolution = population[i]

        // Selection (tournament, size 2)
        parents = []
        for i from 0 to popSize - 1:
            a = random individual from population
            b = random individual from population
            parents.append(fitter of a and b)

        // Crossover (single-point)
        offspring = []
        for i from 0 to popSize - 1, step 2:
            child1, child2 = crossover(parents[i], parents[i+1])
            offspring.append(child1, child2)

        // Mutation
        for each individual in offspring:
            if random() < mutationRate:
                individual = random integer in [0, n-1]

        population = offspring

    return bestFitness
```

## Complexity Analysis

| Case    | Time         | Space |
|---------|-------------|-------|
| Best    | O(g * p * n) | O(p)  |
| Average | O(g * p * n) | O(p)  |
| Worst   | O(g * p * n) | O(p)  |

Where g = generations, p = population size, n = array length (or problem dimension).

**Why these complexities?**

- **Time -- O(g * p * n):** Each generation involves evaluating p individuals (each evaluation may cost up to O(n)), selection, crossover, and mutation operations on p individuals. This repeats for g generations.

- **Space -- O(p):** The algorithm stores the current population of p individuals, plus a temporary offspring population of the same size.

## When to Use

- **Complex optimization landscapes:** GAs handle multimodal, discontinuous, and noisy fitness functions where gradient-based methods fail.
- **Combinatorial optimization:** Problems like the Traveling Salesman Problem, job scheduling, and bin packing.
- **When the search space is very large:** GAs efficiently explore vast solution spaces through parallel population-based search.
- **Black-box optimization:** When the fitness function has no known analytical form or gradient.
- **Multi-objective optimization:** GAs (especially NSGA-II) naturally extend to problems with multiple competing objectives.

## When NOT to Use

- **When exact solutions are required:** GAs are heuristic and provide no guarantee of finding the global optimum.
- **Simple optimization problems:** For convex functions or small search spaces, gradient descent or exhaustive search is more efficient.
- **When evaluation is extremely expensive:** Each generation requires many fitness evaluations. If each evaluation takes hours, consider Bayesian optimization or surrogate-based methods.
- **Real-time applications:** GAs typically require many generations to converge, making them too slow for strict real-time constraints.

## Comparison

| Algorithm | Type | Global Optimum Guarantee | Parallelizable | Best For |
|-----------|------|-------------------------|----------------|----------|
| Genetic Algorithm | Population-based | No | Yes | Complex combinatorial/continuous |
| Simulated Annealing | Single-solution | No (probabilistic) | Limited | Single-objective with smooth landscape |
| Particle Swarm | Population-based | No | Yes | Continuous optimization |
| Gradient Descent | Single-solution | Local only | Limited | Smooth, differentiable functions |
| Exhaustive Search | Complete | Yes | Yes | Small search spaces |

## Implementations

| Language   | File |
|------------|------|
| Python     | [genetic_algorithm.py](python/genetic_algorithm.py) |
| Java       | [GeneticAlgorithm.java](java/GeneticAlgorithm.java) |
| C++        | [genetic_algorithm.cpp](cpp/genetic_algorithm.cpp) |
| C          | [genetic_algorithm.c](c/genetic_algorithm.c) |
| Go         | [genetic_algorithm.go](go/genetic_algorithm.go) |
| TypeScript | [geneticAlgorithm.ts](typescript/geneticAlgorithm.ts) |
| Rust       | [genetic_algorithm.rs](rust/genetic_algorithm.rs) |
| Kotlin     | [GeneticAlgorithm.kt](kotlin/GeneticAlgorithm.kt) |
| Swift      | [GeneticAlgorithm.swift](swift/GeneticAlgorithm.swift) |
| Scala      | [GeneticAlgorithm.scala](scala/GeneticAlgorithm.scala) |
| C#         | [GeneticAlgorithm.cs](csharp/GeneticAlgorithm.cs) |

## References

- Holland, J. H. (1975). *Adaptation in Natural and Artificial Systems*. University of Michigan Press.
- Goldberg, D. E. (1989). *Genetic Algorithms in Search, Optimization, and Machine Learning*. Addison-Wesley.
- Mitchell, M. (1998). *An Introduction to Genetic Algorithms*. MIT Press.
- [Genetic Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Genetic_algorithm)
