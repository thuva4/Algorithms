"""
Prim's algorithm to find the Minimum Spanning Tree (MST) total weight.
Uses a weighted adjacency list.
"""

import heapq


def prim(num_vertices, adj_list):
    """
    Prim's algorithm for MST.

    Args:
        num_vertices: Number of vertices in the graph
        adj_list: Weighted adjacency list where each entry is [neighbor, weight]

    Returns:
        Total weight of the MST
    """
    in_mst = [False] * num_vertices
    key = [float('inf')] * num_vertices
    key[0] = 0

    # Min-heap: (weight, vertex)
    heap = [(0, 0)]
    total_weight = 0

    while heap:
        w, u = heapq.heappop(heap)

        if in_mst[u]:
            continue

        in_mst[u] = True
        total_weight += w

        for neighbor, weight in adj_list.get(u, []):
            if not in_mst[neighbor] and weight < key[neighbor]:
                key[neighbor] = weight
                heapq.heappush(heap, (weight, neighbor))

    return total_weight


if __name__ == "__main__":
    adj_list = {
        0: [[1, 10], [2, 6], [3, 5]],
        1: [[0, 10], [3, 15]],
        2: [[0, 6], [3, 4]],
        3: [[0, 5], [1, 15], [2, 4]],
    }
    result = prim(4, adj_list)
    print(f"MST total weight: {result}")
