from collections import deque

def spfa(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    src = arr[2]
    adj = [[] for _ in range(n)]
    for i in range(m):
        u = arr[3 + 3 * i]
        v = arr[3 + 3 * i + 1]
        w = arr[3 + 3 * i + 2]
        adj[u].append((v, w))

    INF = float('inf')
    dist = [INF] * n
    dist[src] = 0
    in_queue = [False] * n
    queue = deque([src])
    in_queue[src] = True

    while queue:
        u = queue.popleft()
        in_queue[u] = False
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True

    return dist[n - 1] if dist[n - 1] != INF else -1
