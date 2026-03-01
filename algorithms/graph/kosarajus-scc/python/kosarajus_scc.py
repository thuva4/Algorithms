def kosarajus_scc(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    adj = [[] for _ in range(n)]
    radj = [[] for _ in range(n)]
    for i in range(m):
        u = arr[2 + 2 * i]
        v = arr[2 + 2 * i + 1]
        adj[u].append(v)
        radj[v].append(u)

    visited = [False] * n
    order = []

    def dfs1(v):
        visited[v] = True
        for w in adj[v]:
            if not visited[w]:
                dfs1(w)
        order.append(v)

    for v in range(n):
        if not visited[v]:
            dfs1(v)

    visited = [False] * n
    scc_count = 0

    def dfs2(v):
        visited[v] = True
        for w in radj[v]:
            if not visited[w]:
                dfs2(w)

    for v in reversed(order):
        if not visited[v]:
            dfs2(v)
            scc_count += 1

    return scc_count
