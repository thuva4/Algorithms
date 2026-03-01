# Elevator Algorithm (SCAN)

## Overview

The Elevator Algorithm, also known as the SCAN algorithm, is a disk scheduling algorithm that services I/O requests by moving the read/write head in one direction across the disk, servicing all pending requests in that direction, then reversing direction and servicing requests on the return trip. The name comes from its similarity to how an elevator operates: it moves in one direction, stopping at requested floors, then reverses when it reaches the end.

Originally designed for optimizing disk arm movement in hard disk drives, the algorithm minimizes total seek time by avoiding unnecessary back-and-forth movement. It provides a more fair and predictable service pattern than simpler strategies like Shortest Seek Time First (SSTF), which can starve requests at the extremes.

## How It Works

1. **Sort** all pending I/O requests (cylinder numbers) in order.
2. **Determine** the current head position and current direction of movement.
3. **Service requests** in the current direction:
   a. Move the head in the current direction (e.g., toward higher cylinder numbers).
   b. Service each request encountered along the way.
4. **Reverse** direction when the head reaches the end of the disk (or the last request in that direction).
5. **Service remaining requests** in the new direction.
6. **Calculate** the total head movement (sum of absolute differences between consecutive positions visited).

The algorithm ensures that every request is eventually serviced and that the maximum waiting time for any request is bounded by at most two full sweeps across the disk.

## Worked Example

**Disk parameters:** Cylinders 0-199, head starts at cylinder 53, moving toward higher cylinders.

**Pending requests:** [98, 183, 37, 122, 14, 124, 65, 67]

**Step 1 -- Sort requests:** [14, 37, 65, 67, 98, 122, 124, 183]

**Step 2 -- Service requests moving UP (toward 199):**

| Current Position | Next Request | Movement | Running Total |
|-----------------|-------------|----------|---------------|
| 53 | 65 | 12 | 12 |
| 65 | 67 | 2 | 14 |
| 67 | 98 | 31 | 45 |
| 98 | 122 | 24 | 69 |
| 122 | 124 | 2 | 71 |
| 124 | 183 | 59 | 130 |
| 183 | 199 (end) | 16 | 146 |

**Step 3 -- Reverse direction, service requests moving DOWN:**

| Current Position | Next Request | Movement | Running Total |
|-----------------|-------------|----------|---------------|
| 199 | 37 | 162 | 308 |
| 37 | 14 | 23 | 331 |

**Result:** Total head movement = 331 cylinders.

Note: In the LOOK variant (which is common in practice), the head only goes as far as the last request in each direction (183 instead of 199), reducing total movement.

## Pseudocode

```
function elevatorAlgorithm(requests, head, direction, maxCylinder):
    sort requests in ascending order

    // Split requests into those below and above the head
    lower = [r for r in requests if r < head], sorted descending
    upper = [r for r in requests if r >= head], sorted ascending

    totalMovement = 0
    currentPos = head
    sequence = []

    if direction == UP:
        // Service upper requests first, then reverse
        for each request in upper:
            totalMovement += |request - currentPos|
            currentPos = request
            sequence.append(request)

        // Go to end (SCAN) or skip (LOOK variant)
        // totalMovement += |maxCylinder - currentPos|  // SCAN only
        // currentPos = maxCylinder                      // SCAN only

        for each request in lower:
            totalMovement += |request - currentPos|
            currentPos = request
            sequence.append(request)
    else:
        // Service lower requests first, then reverse
        for each request in lower:
            totalMovement += |request - currentPos|
            currentPos = request
            sequence.append(request)

        for each request in upper:
            totalMovement += |request - currentPos|
            currentPos = request
            sequence.append(request)

    return totalMovement
```

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(n log n) | O(n)  |
| Average | O(n log n) | O(n)  |
| Worst   | O(n log n) | O(n)  |

- **Time -- O(n log n):** Dominated by sorting the requests. The servicing pass itself is O(n).
- **Space -- O(n):** Storage for the sorted request list and the split arrays.

The total head movement is bounded by at most 2 * (max cylinder number), regardless of the number or distribution of requests.

## When to Use

- **Disk I/O scheduling:** The primary application. Minimizes total seek time for hard disk drives with mechanical heads.
- **Elevator control systems:** Optimizing the movement of physical elevators to minimize total travel distance.
- **Printer job scheduling:** When a printer head moves linearly (e.g., line printers), scheduling print jobs to minimize head movement.
- **Warehouse robotics:** Optimizing pick routes in automated storage systems where a robot moves along aisles.
- **Any linear scan optimization:** Situations where a resource moves along a one-dimensional axis and must visit multiple requested positions.

## When NOT to Use

- **Solid-state drives (SSDs):** SSDs have no mechanical head movement, so seek time is essentially zero. Disk scheduling algorithms provide no benefit; simple FIFO or NOOP schedulers are preferred.
- **Real-time or latency-critical systems:** The SCAN algorithm can cause long waits for requests near the end the head just passed. For latency-sensitive workloads, consider C-SCAN (Circular SCAN) which provides more uniform wait times.
- **Very few requests:** With only one or two pending requests, the overhead of sorting and partitioning is not worthwhile. A simple nearest-first approach suffices.
- **Non-linear seek costs:** If the cost of moving between positions is not proportional to distance (e.g., network routing), the algorithm's assumptions break down.

## Comparison

| Algorithm | Total Seek | Fairness | Starvation? | Notes |
|-----------|-----------|----------|-------------|-------|
| FCFS (First Come First Served) | High | Perfect | No | Simple but inefficient |
| SSTF (Shortest Seek Time First) | Low | Poor | Yes (extremes) | Greedy, can starve far requests |
| SCAN (Elevator, this) | Moderate | Good | No | Sweeps back and forth |
| C-SCAN (Circular SCAN) | Moderate | Excellent | No | Only services in one direction, wraps around |
| LOOK | Moderate | Good | No | Like SCAN but reverses at last request |
| C-LOOK | Moderate | Excellent | No | Like C-SCAN but reverses at last request |

SCAN provides a good balance between total seek time and fairness. SSTF has lower total seek time but can starve requests at the extremes of the disk. C-SCAN provides the most uniform wait times by always scanning in one direction and jumping back to the start, at the cost of slightly higher total movement. LOOK and C-LOOK are practical improvements that avoid unnecessary travel to the disk ends.

## Implementations

| Language   | File |
|------------|------|
| Java       | [ElevatorAlgorithm.java](java/ElevatorAlgorithm.java) |

## References

- Silberschatz, A., Galvin, P. B., & Gagne, G. (2018). *Operating System Concepts* (10th ed.). Wiley. Chapter 11: Mass-Storage Structure.
- Tanenbaum, A. S., & Bos, H. (2015). *Modern Operating Systems* (4th ed.). Pearson. Chapter 5: Input/Output.
- Denning, P. J. (1967). "Effects of scheduling on file memory operations." *AFIPS Conference Proceedings*, 30, 9-21.
- [Elevator algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Elevator_algorithm)
