from collections import deque


def hld_path_query(n: int, edges: list[list[int]], values: list[int], queries: list[dict]) -> list[int]:
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    parent = [-1] * n
    depth = [0] * n
    queue = deque([0])
    order = [0]
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor == parent[node]:
                continue
            parent[neighbor] = node
            depth[neighbor] = depth[node] + 1
            queue.append(neighbor)
            order.append(neighbor)

    def path_nodes(u: int, v: int) -> list[int]:
        left: list[int] = []
        right: list[int] = []
        while depth[u] > depth[v]:
            left.append(u)
            u = parent[u]
        while depth[v] > depth[u]:
            right.append(v)
            v = parent[v]
        while u != v:
            left.append(u)
            right.append(v)
            u = parent[u]
            v = parent[v]
        left.append(u)
        return left + right[::-1]

    results: list[int] = []
    for query in queries:
        nodes = path_nodes(int(query["u"]), int(query["v"]))
        if query["type"] == "max":
            results.append(max(values[node] for node in nodes))
        else:
            results.append(sum(values[node] for node in nodes))
    return results
