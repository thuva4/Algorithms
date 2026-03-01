from collections import deque


def lowest_common_ancestor(arr):
    """
    Find the LCA of two nodes using binary lifting.

    Input: [n, root, u1, v1, ..., query_a, query_b]
    Returns: LCA node index
    """
    idx = 0
    n = arr[idx]; idx += 1
    root = arr[idx]; idx += 1

    adj = [[] for _ in range(n)]
    num_edges = n - 1
    for _ in range(num_edges):
        u = arr[idx]; idx += 1
        v = arr[idx]; idx += 1
        adj[u].append(v)
        adj[v].append(u)

    qa = arr[idx]; idx += 1
    qb = arr[idx]; idx += 1

    LOG = 1
    while (1 << LOG) < n:
        LOG += 1

    depth = [0] * n
    up = [[-1] * n for _ in range(LOG)]

    # BFS to set up depths and parents
    visited = [False] * n
    visited[root] = True
    queue = deque([root])
    while queue:
        v = queue.popleft()
        for u in adj[v]:
            if not visited[u]:
                visited[u] = True
                depth[u] = depth[v] + 1
                up[0][u] = v
                queue.append(u)

    up[0][root] = root

    for k in range(1, LOG):
        for v in range(n):
            up[k][v] = up[k - 1][up[k - 1][v]]

    def lca(a, b):
        if depth[a] < depth[b]:
            a, b = b, a
        diff = depth[a] - depth[b]
        for k in range(LOG):
            if (diff >> k) & 1:
                a = up[k][a]
        if a == b:
            return a
        for k in range(LOG - 1, -1, -1):
            if up[k][a] != up[k][b]:
                a = up[k][a]
                b = up[k][b]
        return up[0][a]

    return lca(qa, qb)


if __name__ == "__main__":
    print(lowest_common_ancestor([5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 2]))  # 0
    print(lowest_common_ancestor([5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 1, 3]))  # 1
    print(lowest_common_ancestor([3, 0, 0, 1, 0, 2, 2, 2]))              # 2
    print(lowest_common_ancestor([5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 4]))  # 1
