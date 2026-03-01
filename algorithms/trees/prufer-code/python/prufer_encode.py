import heapq


def prufer_encode(n: int, edges: list[list[int]]) -> list[int]:
    if n <= 2:
        return []
    graph = [set() for _ in range(n)]
    for u, v in edges:
        graph[u].add(v)
        graph[v].add(u)

    leaves = [node for node in range(n) if len(graph[node]) == 1]
    heapq.heapify(leaves)
    sequence: list[int] = []

    for _ in range(n - 2):
        leaf = heapq.heappop(leaves)
        neighbor = next(iter(graph[leaf]))
        sequence.append(neighbor)
        graph[neighbor].remove(leaf)
        graph[leaf].clear()
        if len(graph[neighbor]) == 1:
            heapq.heappush(leaves, neighbor)
    return sequence
