"""
Kruskal's algorithm to find the Minimum Spanning Tree (MST) total weight.
Uses Union-Find (Disjoint Set Union) for cycle detection.
"""


class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return False

        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        return True


def kruskal(num_vertices, edges):
    """
    Kruskal's algorithm for MST.

    Args:
        num_vertices: Number of vertices in the graph
        edges: List of [src, dest, weight] edges

    Returns:
        Total weight of the MST
    """
    # Sort edges by weight
    sorted_edges = sorted(edges, key=lambda e: e[2])

    uf = UnionFind(num_vertices)
    total_weight = 0
    edges_used = 0

    for src, dest, weight in sorted_edges:
        if edges_used >= num_vertices - 1:
            break
        if uf.union(src, dest):
            total_weight += weight
            edges_used += 1

    return total_weight


if __name__ == "__main__":
    edges = [[0, 1, 10], [0, 2, 6], [0, 3, 5], [1, 3, 15], [2, 3, 4]]
    result = kruskal(4, edges)
    print(f"MST total weight: {result}")
