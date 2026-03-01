def topological_sort_all(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    adj = [[] for _ in range(n)]
    in_deg = [0] * n
    for i in range(m):
        u = arr[2 + 2 * i]
        v = arr[2 + 2 * i + 1]
        adj[u].append(v)
        in_deg[v] += 1

    visited = [False] * n
    count = [0]

    def backtrack(placed):
        if placed == n:
            count[0] += 1
            return
        for v in range(n):
            if not visited[v] and in_deg[v] == 0:
                visited[v] = True
                for w in adj[v]:
                    in_deg[w] -= 1
                backtrack(placed + 1)
                visited[v] = False
                for w in adj[v]:
                    in_deg[w] += 1

    backtrack(0)
    return count[0]
