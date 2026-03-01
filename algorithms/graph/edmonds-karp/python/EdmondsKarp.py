"""
Edmonds-Karp algorithm (BFS-based Ford-Fulkerson) for maximum flow.
"""

from collections import deque


def edmonds_karp(capacity, source, sink):
    """
    Find maximum flow in a flow network.

    Args:
        capacity: 2D capacity matrix
        source: Source node
        sink: Sink node

    Returns:
        Maximum flow value
    """
    if source == sink:
        return 0

    n = len(capacity)
    # Create residual graph
    residual = [row[:] for row in capacity]
    total_flow = 0

    while True:
        # BFS to find augmenting path
        parent = [-1] * n
        visited = [False] * n
        queue = deque([source])
        visited[source] = True

        while queue and not visited[sink]:
            u = queue.popleft()
            for v in range(n):
                if not visited[v] and residual[u][v] > 0:
                    visited[v] = True
                    parent[v] = u
                    queue.append(v)

        if not visited[sink]:
            break

        # Find minimum capacity along path
        path_flow = float('inf')
        v = sink
        while v != source:
            u = parent[v]
            path_flow = min(path_flow, residual[u][v])
            v = u

        # Update residual capacities
        v = sink
        while v != source:
            u = parent[v]
            residual[u][v] -= path_flow
            residual[v][u] += path_flow
            v = u

        total_flow += path_flow

    return total_flow


if __name__ == "__main__":
    capacity = [
        [0, 10, 10, 0, 0, 0],
        [0, 0, 2, 4, 8, 0],
        [0, 0, 0, 0, 9, 0],
        [0, 0, 0, 0, 0, 10],
        [0, 0, 0, 6, 0, 10],
        [0, 0, 0, 0, 0, 0],
    ]
    result = edmonds_karp(capacity, 0, 5)
    print(f"Maximum flow: {result}")
