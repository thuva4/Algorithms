# Vegas Algorithm (VEGAS Monte Carlo Integration)

## Overview

The VEGAS algorithm is an adaptive Monte Carlo method for numerical integration, developed by G. Peter Lepage in 1978. Unlike simple Monte Carlo integration that samples uniformly, VEGAS uses importance sampling with an adaptive grid: it iteratively refines the probability distribution used for sampling to concentrate points where the integrand has the largest magnitude. This dramatically reduces the variance of the estimate, especially for functions with sharp peaks or localized features.

The name "VEGAS" is not an acronym -- it references Las Vegas algorithms, a class of randomized algorithms that always produce a correct result (or report failure), with runtime that varies randomly.

## How It Works

1. **Initialization:** Divide the integration domain [a, b] into K equal bins. Assign uniform probability g[k] = 1/K to each bin.
2. **Exploration phase (T iterations):**
   - For each iteration, sample one random point from each bin and evaluate |f(x)|.
   - Accumulate the average |f(x)| for each bin across all iterations.
3. **Build importance distribution:**
   - Normalize the accumulated averages: g[k] = avg_k / sum(avg_k).
   - Bins where |f| is large get higher probability.
4. **Estimation phase (S samples):**
   - Sample a bin k according to the distribution g.
   - Within the chosen bin, sample a uniform point x and evaluate f(x).
   - Weight the sample: contribution = (b-a) * f(x) / (g[k] * K * S).
5. **Sum all contributions** to obtain the integral estimate.

## Worked Example

Estimate the integral of f(x) = sqrt(1 - x^2) from -1 to 1 (which equals pi/2).

**Setup:** K = 4 bins over [-1, 1], each of width 0.5.

**Exploration (simplified):**
- Bin 0: [-1.0, -0.5]: avg |f| = 0.71
- Bin 1: [-0.5, 0.0]: avg |f| = 0.94
- Bin 2: [0.0, 0.5]: avg |f| = 0.94
- Bin 3: [0.5, 1.0]: avg |f| = 0.71

**Importance distribution:** g = [0.215, 0.285, 0.285, 0.215] (normalized).

The middle bins (where f(x) is large) receive more samples, while the edge bins (where f drops to 0) receive fewer. This reduces variance compared to uniform sampling.

**After S = 100,000 samples:** Estimate converges to approximately 1.5708, which is pi/2 = 1.5707963...

The 2 * estimate gives pi ~ 3.14159, matching the expected value.

## Pseudocode

```
function vegas(f, a, b, K, T, S):
    g = array of size K, all initialized to 0

    // Exploration: estimate |f| in each bin
    for t from 1 to T:
        for k from 0 to K-1:
            x = a + (b - a) * (random() + k) / K
            g[k] += |f(x)| / T

    // Normalize to form probability distribution
    total = sum(g)
    for k from 0 to K-1:
        g[k] = g[k] / total

    // Importance sampling
    I = 0
    for s from 1 to S:
        k = sample from discrete distribution g
        x = a + (b - a) * (random() + k) / K
        I += (b - a) * f(x) / (g[k] * K * S)

    return I
```

## Complexity Analysis

| Case    | Time         | Space |
|---------|--------------|-------|
| Best    | O(K*T + S)   | O(K)  |
| Average | O(K*T + S)   | O(K)  |
| Worst   | O(K*T + S)   | O(K)  |

- **Exploration phase:** O(K * T) function evaluations to build the importance distribution.
- **Estimation phase:** O(S) function evaluations for the final estimate.
- **Space O(K):** The bin probability array.
- The variance reduction from importance sampling means fewer total samples S are needed compared to uniform Monte Carlo for the same accuracy.

## Applications

- **Particle physics:** Computing high-dimensional cross-section integrals in quantum field theory (VEGAS is the de facto standard in HEP).
- **Statistical mechanics:** Evaluating partition functions and thermodynamic averages.
- **Financial mathematics:** Pricing complex derivatives via Monte Carlo integration.
- **Bayesian statistics:** Computing posterior normalizing constants (evidence) in high-dimensional parameter spaces.
- **Computer graphics:** Light transport integrals (path tracing with importance sampling).

## When NOT to Use

- **Low-dimensional smooth functions:** For 1D or 2D integrals of smooth functions, Gaussian quadrature or Simpson's rule are faster and more accurate.
- **Functions without localized peaks:** If the integrand is nearly constant, uniform Monte Carlo is equally effective and simpler.
- **When the adaptive grid fails:** VEGAS assumes the integrand is approximately separable (factorable along axes). For highly correlated, non-separable integrands, the adaptive grid may not help. Consider MISER or VEGAS+ variants instead.
- **When exact results are needed:** VEGAS provides a statistical estimate with an error bar, not an exact answer.

## Comparison

| Method                  | Time       | Adaptive? | Dimension limit | Notes                                     |
|-------------------------|------------|-----------|-----------------|-------------------------------------------|
| VEGAS                   | O(K*T + S) | Yes       | High (100+)     | Importance sampling; best for peaked functions |
| Simple Monte Carlo      | O(S)       | No        | High            | Uniform sampling; high variance           |
| Simpson's Rule          | O(n^d)     | No        | Low (d <= 3)    | Exact for polynomials; curse of dimensionality |
| Gaussian Quadrature     | O(n^d)     | No        | Low (d <= 3)    | High accuracy for smooth functions        |
| MISER                   | O(S)       | Yes       | High            | Recursive stratification; different tradeoffs |
| Quasi-Monte Carlo       | O(S)       | No        | Moderate         | Low-discrepancy sequences; faster convergence |

## References

- Lepage, G. P. (1978). "A new algorithm for adaptive multidimensional integration." *Journal of Computational Physics*, 27(2), 192-203.
- Lepage, G. P. (1980). "VEGAS: An adaptive multidimensional integration program." Cornell preprint CLNS-80/447.
- Press, W. H., et al. (2007). *Numerical Recipes* (3rd ed.). Cambridge University Press. Section 7.8.
- [VEGAS algorithm -- Wikipedia](https://en.wikipedia.org/wiki/VEGAS_algorithm)

## Implementations

| Language | File |
|----------|------|
| C++      | [vegas_algorithm.cpp](cpp/vegas_algorithm.cpp) |
