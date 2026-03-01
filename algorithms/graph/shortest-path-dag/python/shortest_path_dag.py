def shortest_path_dag(arr):
    """
    Find shortest path from source to vertex n-1 in a DAG.

    Input format: [n, m, src, u1, v1, w1, ...]
    Returns: shortest distance from src to n-1, or -1 if unreachable
    """
    idx = 0
    n = arr[idx]; idx += 1
    m = arr[idx]; idx += 1
    src = arr[idx]; idx += 1

    adj = [[] for _ in range(n)]
    in_degree = [0] * n
    for _ in range(m):
        u = arr[idx]; idx += 1
        v = arr[idx]; idx += 1
        w = arr[idx]; idx += 1
        adj[u].append((v, w))
        in_degree[v] += 1

    # Topological sort using Kahn's algorithm
    from collections import deque
    queue = deque()
    for i in range(n):
        if in_degree[i] == 0:
            queue.append(i)

    topo_order = []
    while queue:
        node = queue.popleft()
        topo_order.append(node)
        for v, w in adj[node]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)

    INF = float('inf')
    dist = [INF] * n
    dist[src] = 0

    for u in topo_order:
        if dist[u] == INF:
            continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w

    return dist[n - 1] if dist[n - 1] != INF else -1


if __name__ == "__main__":
    print(shortest_path_dag([4, 4, 0, 0, 1, 2, 0, 2, 4, 1, 2, 1, 1, 3, 7]))  # 3
    print(shortest_path_dag([3, 3, 0, 0, 1, 5, 0, 2, 3, 1, 2, 1]))            # 3
    print(shortest_path_dag([2, 1, 0, 0, 1, 10]))                              # 10
    print(shortest_path_dag([3, 1, 0, 1, 2, 5]))                               # -1
