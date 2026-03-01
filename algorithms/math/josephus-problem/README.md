# Josephus Problem

## Overview

The Josephus Problem is a theoretical problem in mathematics and computer science. In the classic formulation, n people stand in a circle and every k-th person is eliminated, proceeding around the circle, until only one person remains. The problem asks for the position of the last survivor. For example, with n = 7 people and k = 3, the elimination order is 3, 6, 2, 7, 5, 1, and person 4 survives.

Named after the historian Flavius Josephus, who reportedly used a variant of this problem to survive a Roman siege, the Josephus problem has applications in computer science (circular buffer management, process scheduling), cryptography, and recreational mathematics. The dynamic programming solution computes the answer in O(n) time.

## How It Works

The key recurrence relation is: J(n, k) = (J(n-1, k) + k) mod n, with base case J(1, k) = 0 (using 0-indexed positions). This works because after eliminating the k-th person, the problem reduces to a circle of n-1 people, but with the positions shifted by k. The recurrence unshifts the positions to map the solution of the smaller problem back to the original circle.

### Example

`n = 7` people (positions 1 through 7), every `k = 3` eliminated:

**Simulation of the elimination process:**

```
Circle: 1  2  3  4  5  6  7
                ^
Step 1: Count 3 from start, eliminate 3
Circle: 1  2  _  4  5  6  7
                   ^
Step 2: Count 3 from 4, eliminate 6
Circle: 1  2  _  4  5  _  7
                            ^
Step 3: Count 3 from 7, eliminate 2
Circle: 1  _  _  4  5  _  7
                      ^
Step 4: Count 3 from 4, eliminate 7
Circle: 1  _  _  4  5  _  _
               ^
Step 5: Count 3 from 1, eliminate 5
Circle: 1  _  _  4  _  _  _
               ^
Step 6: Count 3 from 1, eliminate 1
Circle: _  _  _  4  _  _  _

Survivor: 4
```

**Using the recurrence formula (0-indexed):**

| n | J(n, 3) = (J(n-1, 3) + 3) mod n | Position (1-indexed) |
|---|----------------------------------|---------------------|
| 1 | 0 (base case) | 1 |
| 2 | (0 + 3) mod 2 = 1 | 2 |
| 3 | (1 + 3) mod 3 = 1 | 2 |
| 4 | (1 + 3) mod 4 = 0 | 1 |
| 5 | (0 + 3) mod 5 = 3 | 4 |
| 6 | (3 + 3) mod 6 = 0 | 1 |
| 7 | (0 + 3) mod 7 = 3 | 4 |

Result: Survivor is at position `4` (1-indexed)

## Pseudocode

```
function josephus(n, k):
    // 0-indexed position of the survivor
    position = 0

    for i from 2 to n:
        position = (position + k) mod i

    return position + 1    // convert to 1-indexed
```

For the special case k = 2, there is a closed-form solution: J(n) = 2 * L + 1, where n = 2^m + L and 0 <= L < 2^m. This can be computed in O(log n) time using bit manipulation.

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(1)  |
| Average | O(n) | O(1)  |
| Worst   | O(n) | O(1)  |

**Why these complexities?**

- **Best Case -- O(n):** The recurrence builds up from J(1) to J(n), requiring exactly n - 1 iterations regardless of k.

- **Average Case -- O(n):** Each iteration performs one addition and one modulo operation in O(1) time. Total: n - 1 constant-time operations.

- **Worst Case -- O(n):** The computation is uniform for all values of n and k. No input causes worse performance.

- **Space -- O(1):** Only a single position variable is maintained and updated iteratively. No array or recursion stack is needed.

## When to Use

- **Determining the survivor in circular elimination games:** The direct application of the problem.
- **Circular buffer or scheduling analysis:** Understanding which elements survive a round-robin elimination process.
- **Mathematical puzzles and competitions:** The Josephus problem frequently appears in programming contests.
- **When k = 2:** The closed-form solution allows O(log n) computation using the highest set bit.

## When NOT to Use

- **When you need the full elimination order:** The recurrence only finds the survivor. Simulating the full process requires O(n*k) or O(n log n) with a balanced BST.
- **When n is very large and k is also large:** While the recurrence is O(n), for very large n, even linear time may be insufficient. Logarithmic-time algorithms exist for certain k values.
- **When the circle is not homogeneous:** If people have different skip counts or conditional elimination rules, the simple recurrence does not apply.

## Comparison with Similar Algorithms

| Method              | Time       | Space | Notes                                        |
|--------------------|-----------|-------|----------------------------------------------|
| DP Recurrence       | O(n)      | O(1)  | Finds survivor only; optimal for general k    |
| Simulation (list)   | O(n*k)    | O(n)  | Full elimination order; slow for large k      |
| Simulation (BST)    | O(n log n)| O(n)  | Full order; balanced BST for O(log n) removal |
| Closed form (k=2)   | O(log n)  | O(1)  | Special case only; uses bit manipulation      |

## Implementations

| Language | File |
|----------|------|
| C++      | [josephus_problem.cpp](cpp/josephus_problem.cpp) |

## References

- Graham, R. L., Knuth, D. E., & Patashnik, O. (1994). *Concrete Mathematics* (2nd ed.). Addison-Wesley. Chapter 1.3: The Josephus Problem.
- Josephus, F. (c. 75 AD). *The Jewish War*. Book III, Chapter 8.
- [Josephus Problem -- Wikipedia](https://en.wikipedia.org/wiki/Josephus_problem)
