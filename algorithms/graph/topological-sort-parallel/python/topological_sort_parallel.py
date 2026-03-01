from collections import deque


def topological_sort_parallel(data: list[int]) -> int:
    n = data[0]
    m = data[1]

    adj = [[] for _ in range(n)]
    indegree = [0] * n

    idx = 2
    for _ in range(m):
        u, v = data[idx], data[idx + 1]
        adj[u].append(v)
        indegree[v] += 1
        idx += 2

    queue = deque()
    for i in range(n):
        if indegree[i] == 0:
            queue.append(i)

    rounds = 0
    processed = 0

    while queue:
        size = len(queue)
        for _ in range(size):
            node = queue.popleft()
            processed += 1
            for neighbor in adj[node]:
                indegree[neighbor] -= 1
                if indegree[neighbor] == 0:
                    queue.append(neighbor)
        rounds += 1

    return rounds if processed == n else -1
