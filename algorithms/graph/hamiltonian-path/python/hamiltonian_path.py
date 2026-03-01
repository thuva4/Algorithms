def hamiltonian_path(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    if n <= 1:
        return 1
    adj = [[False] * n for _ in range(n)]
    for i in range(m):
        u, v = arr[2 + 2 * i], arr[3 + 2 * i]
        adj[u][v] = True
        adj[v][u] = True

    full = (1 << n) - 1
    dp = [[False] * n for _ in range(1 << n)]
    for i in range(n):
        dp[1 << i][i] = True

    for mask in range(1, 1 << n):
        for i in range(n):
            if not dp[mask][i]:
                continue
            for j in range(n):
                if mask & (1 << j) == 0 and adj[i][j]:
                    dp[mask | (1 << j)][j] = True

    for i in range(n):
        if dp[full][i]:
            return 1
    return 0
