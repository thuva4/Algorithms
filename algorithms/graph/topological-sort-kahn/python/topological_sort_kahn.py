from collections import deque


def topological_sort_kahn(arr: list[int]) -> list[int]:
    if len(arr) < 2:
        return []

    num_vertices = arr[0]
    num_edges = arr[1]

    adj: list[list[int]] = [[] for _ in range(num_vertices)]
    in_degree = [0] * num_vertices

    for i in range(num_edges):
        u = arr[2 + 2 * i]
        v = arr[2 + 2 * i + 1]
        adj[u].append(v)
        in_degree[v] += 1

    queue = deque()
    for v in range(num_vertices):
        if in_degree[v] == 0:
            queue.append(v)

    result: list[int] = []
    while queue:
        u = queue.popleft()
        result.append(u)
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)

    if len(result) == num_vertices:
        return result
    return []
