def count_bridges(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    adj = [[] for _ in range(n)]
    for i in range(m):
        u = arr[2 + 2 * i]
        v = arr[2 + 2 * i + 1]
        adj[u].append(v)
        adj[v].append(u)

    disc = [-1] * n
    low = [0] * n
    parent = [-1] * n
    timer = [0]
    bridge_count = [0]

    def dfs(u):
        disc[u] = timer[0]
        low[u] = timer[0]
        timer[0] += 1

        for v in adj[u]:
            if disc[v] == -1:
                parent[v] = u
                dfs(v)
                low[u] = min(low[u], low[v])
                if low[v] > disc[u]:
                    bridge_count[0] += 1
            elif v != parent[u]:
                low[u] = min(low[u], disc[v])

    for i in range(n):
        if disc[i] == -1:
            dfs(i)

    return bridge_count[0]
