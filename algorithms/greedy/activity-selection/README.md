# Activity Selection

## Overview

The Activity Selection problem is a classic greedy algorithm problem. Given a set of activities, each with a start time and finish time, the goal is to select the maximum number of non-overlapping activities. Two activities are considered non-overlapping if one finishes before the other starts.

This problem arises naturally in scheduling scenarios: assigning meeting rooms, scheduling jobs on a machine, or planning events that share a common resource. The greedy approach of always selecting the activity that finishes earliest provably yields an optimal solution.

## How It Works

The algorithm follows a simple greedy strategy:

1. Parse the flat input array into pairs of (start, finish) times.
2. Sort all activities by their finish times in ascending order.
3. Select the first activity (the one that finishes earliest).
4. For each subsequent activity, if its start time is greater than or equal to the finish time of the last selected activity, select it.
5. Return the count of selected activities.

The key insight is that by always choosing the activity that finishes earliest, we leave as much room as possible for subsequent activities. This greedy choice property, combined with optimal substructure, guarantees an optimal solution.

### Example

Given input: `[1, 2, 3, 4, 0, 6, 5, 7, 8, 9, 5, 9]`

This encodes 6 activities: (1,2), (3,4), (0,6), (5,7), (8,9), (5,9)

**Step 1:** Sort by finish time: (1,2), (3,4), (0,6), (5,7), (5,9), (8,9)

**Step 2:** Greedy selection:

| Activity | Start | Finish | Action | Reason |
|----------|-------|--------|--------|--------|
| (1,2)    | 1     | 2      | Select | First activity |
| (3,4)    | 3     | 4      | Select | 3 >= 2 (no overlap) |
| (0,6)    | 0     | 6      | Skip   | 0 < 4 (overlaps) |
| (5,7)    | 5     | 7      | Select | 5 >= 4 (no overlap) |
| (5,9)    | 5     | 9      | Skip   | 5 < 7 (overlaps) |
| (8,9)    | 8     | 9      | Select | 8 >= 7 (no overlap) |

Result: 4 activities selected: (1,2), (3,4), (5,7), (8,9)

## Pseudocode

```
function activitySelection(arr):
    n = length(arr) / 2
    if n == 0:
        return 0

    activities = []
    for i from 0 to n - 1:
        activities.add((arr[2*i], arr[2*i + 1]))

    sort activities by finish time

    count = 1
    lastFinish = activities[0].finish

    for i from 1 to n - 1:
        if activities[i].start >= lastFinish:
            count += 1
            lastFinish = activities[i].finish

    return count
```

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(n log n) | O(n)  |
| Average | O(n log n) | O(n)  |
| Worst   | O(n log n) | O(n)  |

- **Time -- O(n log n):** Dominated by the sorting step. The greedy selection pass itself is O(n). If activities are already sorted by finish time, the algorithm runs in O(n).
- **Space -- O(n):** Requires storage for the parsed activity pairs and sorting overhead.

## Applications

- **Meeting room scheduling:** Maximize the number of meetings in a single room.
- **Job scheduling:** Schedule maximum jobs on a single machine where each job has a deadline.
- **Resource allocation:** Optimally allocate a shared resource across time-bounded tasks.
- **Interval scheduling:** Foundation for more complex interval scheduling problems.
- **Event planning:** Select the most events that can be attended without conflicts.

## Implementations

| Language   | File |
|------------|------|
| Python     | [activity_selection.py](python/activity_selection.py) |
| Java       | [ActivitySelection.java](java/ActivitySelection.java) |
| C++        | [activity_selection.cpp](cpp/activity_selection.cpp) |
| C          | [activity_selection.c](c/activity_selection.c) |
| Go         | [activity_selection.go](go/activity_selection.go) |
| TypeScript | [activitySelection.ts](typescript/activitySelection.ts) |
| Kotlin     | [ActivitySelection.kt](kotlin/ActivitySelection.kt) |
| Rust       | [activity_selection.rs](rust/activity_selection.rs) |
| Swift      | [ActivitySelection.swift](swift/ActivitySelection.swift) |
| Scala      | [ActivitySelection.scala](scala/ActivitySelection.scala) |
| C#         | [ActivitySelection.cs](csharp/ActivitySelection.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 16: Greedy Algorithms.
- [Activity Selection Problem -- Wikipedia](https://en.wikipedia.org/wiki/Activity_selection_problem)
