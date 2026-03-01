from collections import deque


def longest_path(weighted_adjacency_list: dict, start_node: int) -> dict[str, int | str]:
    graph = {int(node): [(int(v), int(w)) for v, w in edges] for node, edges in weighted_adjacency_list.items()}
    n = max(graph.keys(), default=-1) + 1
    indegree = [0] * n
    for edges in graph.values():
        for neighbor, _ in edges:
            indegree[neighbor] += 1

    queue = deque([node for node in range(n) if indegree[node] == 0])
    topo: list[int] = []
    while queue:
        node = queue.popleft()
        topo.append(node)
        for neighbor, _ in graph.get(node, []):
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    neg_inf = float("-inf")
    dist = [neg_inf] * n
    dist[start_node] = 0
    for node in topo:
        if dist[node] == neg_inf:
            continue
        for neighbor, weight in graph.get(node, []):
            dist[neighbor] = max(dist[neighbor], dist[node] + weight)

    result: dict[str, int | str] = {}
    for node in range(n):
        result[str(node)] = "-Infinity" if dist[node] == neg_inf else int(dist[node])
    return result
