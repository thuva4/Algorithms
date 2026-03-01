# Interval Scheduling Maximization

## Overview

The Interval Scheduling Maximization problem finds the maximum number of non-overlapping intervals (activities, jobs, or events) that can be selected from a given set. Each interval has a start time and a finish time, and two intervals conflict if they overlap in time. The goal is to select as many non-conflicting intervals as possible.

The greedy strategy of always selecting the interval that finishes earliest is provably optimal. This is one of the classic results in greedy algorithm design and serves as a foundational example in algorithms courses for demonstrating the greedy choice property and optimal substructure.

## How It Works

1. **Sort** all intervals by their finish (end) times in ascending order.
2. **Select** the first interval (the one that finishes earliest).
3. **Iterate** through the remaining intervals in sorted order:
   a. If the current interval's start time is greater than or equal to the finish time of the last selected interval (no overlap), select it and update the last finish time.
   b. Otherwise, skip it (it conflicts with the last selected interval).
4. **Return** the count of selected intervals.

The key insight is that by choosing the interval that finishes earliest, we maximize the remaining time available for subsequent intervals. This greedy choice never leads to a suboptimal solution because any optimal solution that does not include the earliest-finishing interval can be modified to include it without reducing the total count.

## Worked Example

**Input intervals:** [(1,4), (3,5), (0,6), (5,7), (3,9), (5,9), (6,10), (8,11), (8,12), (2,14), (12,16)]

**Step 1 -- Sort by finish time:**

| Interval | Start | Finish |
|----------|-------|--------|
| A | 1 | 4 |
| B | 3 | 5 |
| C | 0 | 6 |
| D | 5 | 7 |
| E | 3 | 9 |
| F | 5 | 9 |
| G | 6 | 10 |
| H | 8 | 11 |
| I | 8 | 12 |
| J | 2 | 14 |
| K | 12 | 16 |

**Step 2 -- Greedy selection:**

| Interval | Start | Finish | Last Finish | Action | Reason |
|----------|-------|--------|-------------|--------|--------|
| A | 1 | 4 | -- | Select | First interval |
| B | 3 | 5 | 4 | Skip | 3 < 4 (overlaps) |
| C | 0 | 6 | 4 | Skip | 0 < 4 (overlaps) |
| D | 5 | 7 | 4 | Select | 5 >= 4 (no overlap) |
| E | 3 | 9 | 7 | Skip | 3 < 7 (overlaps) |
| F | 5 | 9 | 7 | Skip | 5 < 7 (overlaps) |
| G | 6 | 10 | 7 | Skip | 6 < 7 (overlaps) |
| H | 8 | 11 | 7 | Select | 8 >= 7 (no overlap) |
| I | 8 | 12 | 11 | Skip | 8 < 11 (overlaps) |
| J | 2 | 14 | 11 | Skip | 2 < 11 (overlaps) |
| K | 12 | 16 | 11 | Select | 12 >= 11 (no overlap) |

**Result:** 4 intervals selected: A(1,4), D(5,7), H(8,11), K(12,16).

## Pseudocode

```
function intervalScheduling(intervals):
    n = length(intervals)
    if n == 0:
        return 0

    sort intervals by finish time ascending

    count = 1
    lastFinish = intervals[0].finish

    for i from 1 to n - 1:
        if intervals[i].start >= lastFinish:
            count += 1
            lastFinish = intervals[i].finish

    return count
```

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(n log n) | O(n)  |
| Average | O(n log n) | O(n)  |
| Worst   | O(n log n) | O(n)  |

- **Time -- O(n log n):** Dominated by the sorting step. The greedy selection pass itself is O(n). If intervals are pre-sorted, the algorithm runs in O(n).
- **Space -- O(n):** Required for sorting and storing the intervals.

## When to Use

- **Meeting room scheduling:** Maximize the number of meetings that can be held in a single room.
- **Resource allocation:** Allocate a single resource (machine, room, vehicle) to the maximum number of requests.
- **Job scheduling on a single machine:** Schedule the most jobs when each job has a fixed start and end time.
- **Bandwidth or channel allocation:** Maximize the number of non-overlapping transmissions on a shared medium.
- **Event planning:** Select the maximum number of non-conflicting events to attend.

## When NOT to Use

- **Weighted intervals:** If intervals have different values (weights) and the goal is to maximize total value rather than count, use weighted interval scheduling (solvable by dynamic programming in O(n log n)).
- **Multiple resources:** If multiple machines or rooms are available, the problem becomes interval partitioning (minimum number of resources needed), which requires a different approach (e.g., sorting by start time with a priority queue).
- **Intervals can be shifted:** If intervals have flexible start times and only their durations are fixed, the problem becomes a different scheduling variant.
- **Dependent intervals:** If selecting one interval forces or prevents the selection of others (precedence constraints), the problem is no longer solvable by this greedy approach.
- **Minimizing idle time:** If the goal is to minimize gaps between scheduled intervals rather than maximizing count, a different objective function is needed.

## Comparison

| Problem | Strategy | Time | Notes |
|---------|----------|------|-------|
| Interval Scheduling Maximization (this) | Greedy (earliest finish) | O(n log n) | Maximize count, single resource |
| Weighted Interval Scheduling | DP + binary search | O(n log n) | Maximize total weight |
| Interval Partitioning | Greedy (earliest start) | O(n log n) | Minimize number of resources |
| Activity Selection | Greedy (earliest finish) | O(n log n) | Equivalent problem formulation |
| Job Scheduling with Deadlines | Greedy (max profit) | O(n^2) or O(n log n) | Different objective (profit, not count) |

Interval Scheduling Maximization and Activity Selection are essentially the same problem with different names. The key variants differ in whether intervals have weights, whether multiple resources are available, and whether the objective is count, total value, or resource minimization.

## Implementations

| Language   | File |
|------------|------|
| Python     | [interval_scheduling.py](python/interval_scheduling.py) |
| Java       | [IntervalScheduling.java](java/IntervalScheduling.java) |
| C++        | [interval_scheduling.cpp](cpp/interval_scheduling.cpp) |
| C          | [interval_scheduling.c](c/interval_scheduling.c) |
| Go         | [interval_scheduling.go](go/interval_scheduling.go) |
| TypeScript | [intervalScheduling.ts](typescript/intervalScheduling.ts) |
| Rust       | [interval_scheduling.rs](rust/interval_scheduling.rs) |
| Kotlin     | [IntervalScheduling.kt](kotlin/IntervalScheduling.kt) |
| Swift      | [IntervalScheduling.swift](swift/IntervalScheduling.swift) |
| Scala      | [IntervalScheduling.scala](scala/IntervalScheduling.scala) |
| C#         | [IntervalScheduling.cs](csharp/IntervalScheduling.cs) |

## References

- Kleinberg, J., & Tardos, E. (2006). *Algorithm Design*. Addison-Wesley. Chapter 4.1: Interval Scheduling.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 16: Greedy Algorithms.
- Kolen, A. W. J., Lenstra, J. K., Papadimitriou, C. H., & Spieksma, F. C. R. (2007). "Interval scheduling: A survey." *Naval Research Logistics*, 54(5), 530-543.
- [Interval scheduling -- Wikipedia](https://en.wikipedia.org/wiki/Interval_scheduling)
