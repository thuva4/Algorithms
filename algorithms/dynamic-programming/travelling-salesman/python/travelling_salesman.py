def travelling_salesman(arr: list[int]) -> int:
    n = arr[0]
    if n <= 1:
        return 0
    dist = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            dist[i][j] = arr[1 + i * n + j]

    INF = float('inf')
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0

    for mask in range(1, 1 << n):
        for i in range(n):
            if dp[mask][i] == INF:
                continue
            if not (mask & (1 << i)):
                continue
            for j in range(n):
                if mask & (1 << j):
                    continue
                new_mask = mask | (1 << j)
                cost = dp[mask][i] + dist[i][j]
                if cost < dp[new_mask][j]:
                    dp[new_mask][j] = cost

    full = (1 << n) - 1
    result = INF
    for i in range(n):
        if dp[full][i] + dist[i][0] < result:
            result = dp[full][i] + dist[i][0]

    return int(result)
