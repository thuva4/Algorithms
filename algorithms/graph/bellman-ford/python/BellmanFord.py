#!/usr/bin/env python3
"""
Bellman-Ford Algorithm

Computes shortest paths from a single source vertex to all other vertices
in a weighted directed graph. Handles negative edge weights and detects
negative-weight cycles.

Time Complexity: O(V * E) where V = vertices, E = edges
Space Complexity: O(V) for the distance array
"""


def bellman_ford(num_vertices: int, edges_list: list, start_node: int):
    """
    Run the Bellman-Ford algorithm from a given source vertex.

    Args:
        num_vertices: The number of vertices in the graph (labeled 0 to n-1).
        edges_list: A list of edges, where each edge is [u, v, weight]
                    representing a directed edge from u to v with the given weight.
        start_node: The source vertex to compute shortest paths from.

    Returns:
        A dictionary mapping vertex (as string) to its shortest distance from
        start_node. Returns "negative_cycle" if a negative-weight cycle is
        reachable from the source. Unreachable vertices have distance Infinity.
    """
    INF = float("inf")
    dist = [INF] * num_vertices
    dist[start_node] = 0

    # Relax all edges V-1 times.
    # After iteration i, dist[v] holds the shortest path from start_node to v
    # using at most i+1 edges.
    for _ in range(num_vertices - 1):
        updated = False
        for u, v, weight in edges_list:
            if dist[u] != INF and dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                updated = True
        # Early termination: if no distances were updated, we are done.
        if not updated:
            break

    # Check for negative-weight cycles.
    # If any edge can still be relaxed, a negative cycle exists.
    for u, v, weight in edges_list:
        if dist[u] != INF and dist[u] + weight < dist[v]:
            return "negative_cycle"

    # Build the result dictionary with string keys.
    result = {}
    for i in range(num_vertices):
        if dist[i] == INF:
            result[str(i)] = INF
        else:
            result[str(i)] = dist[i]

    return result


if __name__ == "__main__":
    # Example: simple weighted graph
    # 4 vertices, edges: 0->1 (4), 0->2 (1), 2->1 (2), 1->3 (1), 2->3 (5)
    edges = [[0, 1, 4], [0, 2, 1], [2, 1, 2], [1, 3, 1], [2, 3, 5]]
    result = bellman_ford(4, edges, 0)
    print("Shortest distances from vertex 0:", result)
    # Expected: {'0': 0, '1': 3, '2': 1, '3': 4}

    # Example: negative weight edges
    edges_neg = [[0, 1, 1], [1, 2, -3], [2, 3, 2], [0, 3, 5]]
    result_neg = bellman_ford(4, edges_neg, 0)
    print("With negative weights:", result_neg)
    # Expected: {'0': 0, '1': 1, '2': -2, '3': 0}

    # Example: negative cycle detection
    edges_cycle = [[0, 1, 1], [1, 2, -1], [2, 0, -1]]
    result_cycle = bellman_ford(3, edges_cycle, 0)
    print("Negative cycle test:", result_cycle)
    # Expected: "negative_cycle"
