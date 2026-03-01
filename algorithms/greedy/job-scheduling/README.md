# Job Scheduling (Weighted)

## Overview

The Weighted Job Scheduling problem (also known as Job Sequencing with Deadlines) involves scheduling a set of jobs to maximize total profit. Each job has a deadline and a profit, and each job takes one unit of time to complete. Only one job can be executed at a time, and a job must be completed by its deadline to earn its profit. The goal is to select and schedule a subset of jobs to maximize the total profit earned.

The greedy approach sorts jobs by profit in descending order and assigns each job to the latest available time slot before its deadline. This ensures that high-profit jobs are prioritized while preserving as many earlier slots as possible for other jobs.

## How It Works

1. **Parse** the input into jobs with (deadline, profit) pairs.
2. **Sort** all jobs by profit in descending order.
3. **Determine** the maximum deadline across all jobs; this defines the total number of available time slots.
4. **Create** a slot array of size equal to the maximum deadline, initially all empty.
5. **For each job** (in decreasing profit order):
   a. Starting from the job's deadline, search backward for the latest empty slot.
   b. If an empty slot is found, assign the job to that slot and add its profit to the total.
   c. If no empty slot exists before the deadline, skip the job.
6. **Return** the total profit of all scheduled jobs.

## Worked Example

**Input:** 4 jobs: (deadline=4, profit=20), (deadline=1, profit=10), (deadline=1, profit=40), (deadline=1, profit=30)

**Step 1 -- Sort by profit (descending):**

| Job | Deadline | Profit |
|-----|----------|--------|
| C   | 1        | 40     |
| D   | 1        | 30     |
| A   | 4        | 20     |
| B   | 1        | 10     |

**Step 2 -- Maximum deadline = 4, so slots = [_, _, _, _] (slots 1 through 4)**

**Step 3 -- Greedy assignment:**

| Job | Deadline | Profit | Try Slot | Action | Slots State |
|-----|----------|--------|----------|--------|-------------|
| C   | 1        | 40     | 1        | Assign to slot 1 | [C, _, _, _] |
| D   | 1        | 30     | 1 (full) | No empty slot <= 1 | Skip |
| A   | 4        | 20     | 4        | Assign to slot 4 | [C, _, _, A] |
| B   | 1        | 10     | 1 (full) | No empty slot <= 1 | Skip |

**Result:** Jobs C and A are scheduled. Total profit = 40 + 20 = 60.

## Pseudocode

```
function jobScheduling(jobs):
    n = length(jobs)
    if n == 0:
        return 0

    sort jobs by profit descending

    // Find maximum deadline
    maxDeadline = 0
    for each job in jobs:
        maxDeadline = max(maxDeadline, job.deadline)

    // Initialize slots (1-indexed)
    slots = array of size maxDeadline, all set to EMPTY

    totalProfit = 0

    for each job in jobs:
        // Find the latest available slot before or at the deadline
        for slot from min(job.deadline, maxDeadline) down to 1:
            if slots[slot] == EMPTY:
                slots[slot] = job
                totalProfit += job.profit
                break

    return totalProfit
```

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(n log n) | O(n)  |
| Average | O(n log n) | O(n)  |
| Worst   | O(n^2)     | O(n)  |

- **Time:** Sorting takes O(n log n). The slot-finding step takes O(n) in the worst case per job (searching backward through all slots), giving O(n^2) total in the worst case. Using a Union-Find (disjoint set) data structure to track the next available slot reduces this to O(n * alpha(n)), which is nearly O(n).
- **Space -- O(n):** For the sorted job list and the slot array (bounded by the maximum deadline, which is at most n).

## When to Use

- **CPU task scheduling:** Prioritizing high-value tasks with deadlines on a single processor.
- **Manufacturing job scheduling:** Sequencing production jobs to maximize revenue when each job has a delivery deadline.
- **Project management:** Selecting which projects to undertake when resources are limited and deadlines are fixed.
- **Advertisement scheduling:** Selecting which ad slots to fill to maximize revenue within time constraints.
- **Assignment problems:** Any scenario where tasks have deadlines, profits, and unit processing times.

## When NOT to Use

- **Variable processing times:** If jobs take different amounts of time (not unit time), the problem becomes the weighted job scheduling problem, which requires dynamic programming.
- **Multiple machines:** If multiple processors are available, the problem becomes a parallel machine scheduling problem, requiring different algorithms (e.g., LPT for makespan minimization).
- **Precedence constraints:** If some jobs must be completed before others can start, this greedy approach does not account for dependencies. Use topological sort-based scheduling instead.
- **Preemptive scheduling:** If jobs can be interrupted and resumed, different algorithms (e.g., Earliest Deadline First) are more appropriate.
- **Minimizing lateness rather than maximizing profit:** If the goal is to minimize maximum lateness, sort by deadline (not profit) and schedule in that order.

## Comparison

| Problem Variant | Strategy | Time | Notes |
|----------------|----------|------|-------|
| Job Scheduling with Deadlines (this) | Greedy (max profit) | O(n^2) or O(n alpha(n)) | Unit-time jobs, maximize profit |
| Weighted Job Scheduling (variable time) | DP + binary search | O(n log n) | Jobs with durations and weights |
| Interval Scheduling Maximization | Greedy (earliest finish) | O(n log n) | Maximize count, not weighted |
| Earliest Deadline First (EDF) | Greedy (earliest deadline) | O(n log n) | Minimize maximum lateness |
| Shortest Job First (SJF) | Greedy (shortest job) | O(n log n) | Minimize average completion time |

The greedy approach for unit-time job scheduling with deadlines and profits is optimal. For non-unit processing times with weights, dynamic programming is needed. The choice of scheduling algorithm depends heavily on the objective function (maximize profit vs. minimize lateness vs. minimize completion time) and the job characteristics (unit vs. variable time, deadlines vs. no deadlines).

## Implementations

| Language   | File |
|------------|------|
| Python     | [job_scheduling.py](python/job_scheduling.py) |
| Java       | [JobScheduling.java](java/JobScheduling.java) |
| C++        | [job_scheduling.cpp](cpp/job_scheduling.cpp) |
| C          | [job_scheduling.c](c/job_scheduling.c) |
| Go         | [job_scheduling.go](go/job_scheduling.go) |
| TypeScript | [jobScheduling.ts](typescript/jobScheduling.ts) |
| Rust       | [job_scheduling.rs](rust/job_scheduling.rs) |
| Kotlin     | [JobScheduling.kt](kotlin/JobScheduling.kt) |
| Swift      | [JobScheduling.swift](swift/JobScheduling.swift) |
| Scala      | [JobScheduling.scala](scala/JobScheduling.scala) |
| C#         | [JobScheduling.cs](csharp/JobScheduling.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 16: Greedy Algorithms.
- Kleinberg, J., & Tardos, E. (2006). *Algorithm Design*. Addison-Wesley. Chapter 4: Greedy Algorithms.
- Sahni, S. (1976). "Algorithms for scheduling independent tasks." *Journal of the ACM*, 23(1), 116-127.
- [Job-shop scheduling -- Wikipedia](https://en.wikipedia.org/wiki/Job-shop_scheduling)
