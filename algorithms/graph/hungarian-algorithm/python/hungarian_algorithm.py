"""
Hungarian Algorithm - Solve the assignment problem in O(n^3).
Given an n x n cost matrix, find a minimum cost perfect matching.
"""

from typing import List, Tuple


def hungarian(cost_matrix: List[List[int]]) -> Tuple[List[int], int]:
    """
    Solve the assignment problem using the Hungarian algorithm.

    Args:
        cost_matrix: n x n matrix where cost_matrix[i][j] is the cost of
                     assigning worker i to job j.

    Returns:
        A tuple (assignment, total_cost) where assignment[i] is the job
        assigned to worker i, and total_cost is the sum of assigned costs.
    """
    n = len(cost_matrix)
    INF = float('inf')

    # u[i] = potential of worker i, v[j] = potential of job j
    u = [0] * (n + 1)
    v = [0] * (n + 1)
    # match_job[j] = worker matched to job j (1-indexed, 0 = unmatched)
    match_job = [0] * (n + 1)

    for i in range(1, n + 1):
        # Start augmenting path from worker i
        match_job[0] = i
        j0 = 0  # virtual job 0
        dist = [INF] * (n + 1)
        used = [False] * (n + 1)
        prev_job = [0] * (n + 1)

        while True:
            used[j0] = True
            w = match_job[j0]
            delta = INF
            j1 = -1

            for j in range(1, n + 1):
                if not used[j]:
                    cur = cost_matrix[w - 1][j - 1] - u[w] - v[j]
                    if cur < dist[j]:
                        dist[j] = cur
                        prev_job[j] = j0
                    if dist[j] < delta:
                        delta = dist[j]
                        j1 = j

            for j in range(n + 1):
                if used[j]:
                    u[match_job[j]] += delta
                    v[j] -= delta
                else:
                    dist[j] -= delta

            j0 = j1
            if match_job[j0] == 0:
                break

        # Update matching along the augmenting path
        while j0 != 0:
            match_job[j0] = match_job[prev_job[j0]]
            j0 = prev_job[j0]

    # Build result: assignment[worker] = job (0-indexed)
    assignment = [0] * n
    for j in range(1, n + 1):
        assignment[match_job[j] - 1] = j - 1

    total_cost = sum(cost_matrix[i][assignment[i]] for i in range(n))
    return assignment, total_cost


if __name__ == "__main__":
    matrix = [[9, 2, 7], [6, 4, 3], [5, 8, 1]]
    assignment, cost = hungarian(matrix)
    print(f"Assignment: {assignment}")
    print(f"Total cost: {cost}")
