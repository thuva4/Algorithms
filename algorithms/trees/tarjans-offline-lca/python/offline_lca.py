from collections import deque


def offline_lca(n: int, edges: list[list[int]], queries: list[list[int]]) -> list[int]:
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    parent = [-1] * n
    depth = [0] * n
    queue = deque([0])
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor == parent[node]:
                continue
            parent[neighbor] = node
            depth[neighbor] = depth[node] + 1
            queue.append(neighbor)

    def lca(u: int, v: int) -> int:
        while depth[u] > depth[v]:
            u = parent[u]
        while depth[v] > depth[u]:
            v = parent[v]
        while u != v:
            u = parent[u]
            v = parent[v]
        return u

    return [lca(u, v) for u, v in queries]
