def ford_fulkerson(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    src = arr[2]
    sink = arr[3]
    cap = [[0] * n for _ in range(n)]
    for i in range(m):
        cap[arr[4 + 3 * i]][arr[5 + 3 * i]] += arr[6 + 3 * i]

    def dfs(u, t, flow, visited):
        if u == t:
            return flow
        visited[u] = True
        for v in range(n):
            if not visited[v] and cap[u][v] > 0:
                d = dfs(v, t, min(flow, cap[u][v]), visited)
                if d > 0:
                    cap[u][v] -= d
                    cap[v][u] += d
                    return d
        return 0

    max_flow = 0
    while True:
        visited = [False] * n
        flow = dfs(src, sink, float('inf'), visited)
        if flow == 0:
            break
        max_flow += flow
    return max_flow
