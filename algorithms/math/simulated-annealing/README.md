# Simulated Annealing

## Overview

Simulated Annealing (SA) is a probabilistic metaheuristic for approximating the global optimum of a given function. Inspired by the annealing process in metallurgy -- where a material is heated and then slowly cooled to remove defects and reach a low-energy crystalline state -- the algorithm explores the solution space by accepting worse solutions with a probability that decreases over time (as the "temperature" cools). This mechanism allows SA to escape local optima, making it effective for combinatorial optimization problems where the search landscape is complex and multi-modal.

## How It Works

1. **Initialize:** Start with an initial solution s and an initial temperature T.
2. **Iterate** until the temperature drops below a threshold or a maximum number of iterations is reached:
   a. **Generate neighbor:** Perturb the current solution to create a neighboring solution s'.
   b. **Evaluate:** Compute the change in cost: delta = cost(s') - cost(s).
   c. **Accept or reject:**
      - If delta < 0 (neighbor is better), accept s' unconditionally.
      - If delta >= 0 (neighbor is worse), accept s' with probability exp(-delta / T).
   d. **Cool down:** Reduce temperature: T = T * alpha, where alpha is the cooling rate (typically 0.9 to 0.999).
3. **Return** the best solution found across all iterations.

The acceptance probability exp(-delta / T) is high when T is large (early on, allowing exploration) and low when T is small (later, favoring exploitation).

## Worked Example

Find the minimum of the array [5, 3, 8, 1, 7] using simulated annealing.

**Setup:** T = 100, alpha = 0.8, current index = 0 (value 5), best = 5.

| Step | T     | Current (idx, val) | Neighbor (idx, val) | delta | Accept? | Best |
|------|-------|--------------------|---------------------|-------|---------|------|
| 1    | 100   | (0, 5)             | (2, 8)              | +3    | exp(-3/100)=0.97, rand=0.5, yes | 5 |
| 2    | 80    | (2, 8)             | (1, 3)              | -5    | yes (better) | 3 |
| 3    | 64    | (1, 3)             | (4, 7)              | +4    | exp(-4/64)=0.94, rand=0.99, no | 3 |
| 4    | 51.2  | (1, 3)             | (3, 1)              | -2    | yes (better) | 1 |
| 5    | 41.0  | (3, 1)             | (0, 5)              | +4    | exp(-4/41)=0.91, rand=0.95, no | 1 |

Result: minimum value = **1** at index 3.

## Pseudocode

```
function simulatedAnnealing(data, T_init, T_min, alpha, seed):
    rng = initRandom(seed)
    current = randomInitialSolution(rng)
    best = current
    T = T_init

    while T > T_min:
        neighbor = generateNeighbor(current, rng)
        delta = cost(neighbor) - cost(current)

        if delta < 0:
            current = neighbor
        else:
            if rng.random() < exp(-delta / T):
                current = neighbor

        if cost(current) < cost(best):
            best = current

        T = T * alpha

    return best
```

## Complexity Analysis

| Case    | Time               | Space |
|---------|--------------------|-------|
| Best    | O(n * iterations)  | O(n)  |
| Average | O(n * iterations)  | O(n)  |
| Worst   | O(n * iterations)  | O(n)  |

- **Time:** Depends on the cooling schedule. With geometric cooling (T = T * alpha), the number of iterations is O(log(T_init / T_min) / log(1/alpha)). Each iteration evaluates cost and generates a neighbor, which may take O(n) for an n-element problem.
- **Space O(n):** Stores the current solution, best solution, and the input data.

## Applications

- **Traveling Salesman Problem (TSP):** Finding near-optimal tours through cities.
- **VLSI circuit design:** Placing and routing components to minimize wire length.
- **Job scheduling:** Assigning tasks to machines to minimize makespan or cost.
- **Protein folding:** Searching for minimum-energy conformations.
- **Image processing:** Optimizing pixel assignments in segmentation and denoising.
- **Graph partitioning:** Minimizing edge cuts between partitions.

## When NOT to Use

- **When an exact solution is required:** SA is a heuristic and provides no guarantee of finding the true global optimum.
- **When the problem has efficient exact algorithms:** For problems solvable in polynomial time (e.g., shortest path, minimum spanning tree), use the exact algorithm instead.
- **When the cost function is cheap but the search space is tiny:** Exhaustive search may be faster than tuning SA parameters.
- **When the cooling schedule is difficult to tune:** SA performance is highly sensitive to the choice of T_init, alpha, and neighbor generation. Poor tuning yields poor results.
- **When parallelism is critical:** While parallel SA variants exist, the inherently sequential nature of the Markov chain makes it less naturally parallelizable than population-based methods (e.g., genetic algorithms).

## Comparison

| Method                | Type            | Guarantees optimal? | Parameters         | Notes                                    |
|-----------------------|-----------------|---------------------|--------------------|------------------------------------------|
| Simulated Annealing   | Single-solution | No                  | T, alpha, neighbor | Escapes local optima; simple to implement |
| Genetic Algorithm     | Population      | No                  | Pop size, mutation | Good exploration; more parameters         |
| Hill Climbing         | Single-solution | No (local)          | Neighbor function  | Fast but trapped in local optima          |
| Tabu Search           | Single-solution | No                  | Tabu list size     | Memory-based; avoids revisiting           |
| Branch and Bound      | Exact           | Yes                 | Bounding function  | Exponential worst case                    |
| Gradient Descent      | Single-solution | No (local)*         | Learning rate      | Only for continuous, differentiable problems |

\* Gradient descent finds local optima; convex problems have a unique global optimum.

## References

- Kirkpatrick, S., Gelatt, C. D., & Vecchi, M. P. (1983). "Optimization by Simulated Annealing." *Science*, 220(4598), 671-680.
- Cerny, V. (1985). "Thermodynamical approach to the traveling salesman problem." *Journal of Optimization Theory and Applications*, 45(1), 41-51.
- Aarts, E. H. L., & Korst, J. (1989). *Simulated Annealing and Boltzmann Machines*. Wiley.
- [Simulated annealing -- Wikipedia](https://en.wikipedia.org/wiki/Simulated_annealing)

## Implementations

| Language   | File |
|------------|------|
| Python     | [simulated_annealing.py](python/simulated_annealing.py) |
| Java       | [SimulatedAnnealing.java](java/SimulatedAnnealing.java) |
| C++        | [simulated_annealing.cpp](cpp/simulated_annealing.cpp) |
| C          | [simulated_annealing.c](c/simulated_annealing.c) |
| Go         | [simulated_annealing.go](go/simulated_annealing.go) |
| TypeScript | [simulatedAnnealing.ts](typescript/simulatedAnnealing.ts) |
| Rust       | [simulated_annealing.rs](rust/simulated_annealing.rs) |
| Kotlin     | [SimulatedAnnealing.kt](kotlin/SimulatedAnnealing.kt) |
| Swift      | [SimulatedAnnealing.swift](swift/SimulatedAnnealing.swift) |
| Scala      | [SimulatedAnnealing.scala](scala/SimulatedAnnealing.scala) |
| C#         | [SimulatedAnnealing.cs](csharp/SimulatedAnnealing.cs) |
