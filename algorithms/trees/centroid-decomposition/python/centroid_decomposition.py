def centroid_decomposition(arr):
    """
    Build a centroid decomposition and return the max depth of the decomposition tree.

    Input format: [n, u1, v1, u2, v2, ...]
    Returns: max depth of centroid decomposition tree
    """
    idx = 0
    n = arr[idx]; idx += 1
    if n <= 1:
        return 0

    adj = [[] for _ in range(n)]
    m = (len(arr) - 1) // 2
    for _ in range(m):
        u = arr[idx]; idx += 1
        v = arr[idx]; idx += 1
        adj[u].append(v)
        adj[v].append(u)

    removed = [False] * n
    subtree_size = [0] * n

    def get_subtree_size(v, parent):
        subtree_size[v] = 1
        for u in adj[v]:
            if u != parent and not removed[u]:
                get_subtree_size(u, v)
                subtree_size[v] += subtree_size[u]

    def get_centroid(v, parent, tree_size):
        for u in adj[v]:
            if u != parent and not removed[u] and subtree_size[u] > tree_size // 2:
                return get_centroid(u, v, tree_size)
        return v

    def decompose(v, depth):
        get_subtree_size(v, -1)
        centroid = get_centroid(v, -1, subtree_size[v])
        removed[centroid] = True

        max_depth = depth
        for u in adj[centroid]:
            if not removed[u]:
                result = decompose(u, depth + 1)
                if result > max_depth:
                    max_depth = result

        removed[centroid] = False
        return max_depth

    return decompose(0, 0)


if __name__ == "__main__":
    print(centroid_decomposition([4, 0, 1, 1, 2, 2, 3]))  # 2
    print(centroid_decomposition([5, 0, 1, 0, 2, 0, 3, 0, 4]))  # 1
    print(centroid_decomposition([1]))  # 0
    print(centroid_decomposition([7, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6]))  # 2
