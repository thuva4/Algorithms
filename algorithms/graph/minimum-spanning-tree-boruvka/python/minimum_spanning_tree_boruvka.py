def minimum_spanning_tree_boruvka(arr):
    """
    Find the minimum spanning tree using Boruvka's algorithm.

    Input format: [n, m, u1, v1, w1, u2, v2, w2, ...]
    Returns: total weight of the MST
    """
    idx = 0
    n = arr[idx]; idx += 1
    m = arr[idx]; idx += 1
    edges = []
    for i in range(m):
        u = arr[idx]; idx += 1
        v = arr[idx]; idx += 1
        w = arr[idx]; idx += 1
        edges.append((u, v, w))

    parent = list(range(n))
    rank = [0] * n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(x, y):
        rx, ry = find(x), find(y)
        if rx == ry:
            return False
        if rank[rx] < rank[ry]:
            rx, ry = ry, rx
        parent[ry] = rx
        if rank[rx] == rank[ry]:
            rank[rx] += 1
        return True

    total_weight = 0
    num_components = n

    while num_components > 1:
        # cheapest[component] = (weight, edge_index)
        cheapest = [-1] * n

        for i, (u, v, w) in enumerate(edges):
            ru, rv = find(u), find(v)
            if ru == rv:
                continue
            if cheapest[ru] == -1 or w < edges[cheapest[ru]][2]:
                cheapest[ru] = i
            if cheapest[rv] == -1 or w < edges[cheapest[rv]][2]:
                cheapest[rv] = i

        for node in range(n):
            if cheapest[node] != -1:
                u, v, w = edges[cheapest[node]]
                if union(u, v):
                    total_weight += w
                    num_components -= 1

    return total_weight


if __name__ == "__main__":
    print(minimum_spanning_tree_boruvka([3, 3, 0, 1, 1, 1, 2, 2, 0, 2, 3]))  # 3
    print(minimum_spanning_tree_boruvka([4, 5, 0, 1, 10, 0, 2, 6, 0, 3, 5, 1, 3, 15, 2, 3, 4]))  # 19
    print(minimum_spanning_tree_boruvka([2, 1, 0, 1, 7]))  # 7
    print(minimum_spanning_tree_boruvka([4, 3, 0, 1, 1, 1, 2, 2, 2, 3, 3]))  # 6
