import sys

def bitmask_dp(n, cost):
    """Minimum cost assignment using bitmask DP."""
    INF = float('inf')
    dp = [INF] * (1 << n)
    dp[0] = 0

    for mask in range(1 << n):
        if dp[mask] == INF:
            continue
        worker = bin(mask).count('1')
        if worker >= n:
            continue
        for job in range(n):
            if not (mask & (1 << job)):
                new_mask = mask | (1 << job)
                dp[new_mask] = min(dp[new_mask], dp[mask] + cost[worker][job])

    return dp[(1 << n) - 1]


if __name__ == "__main__":
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    cost = []
    for i in range(n):
        row = []
        for j in range(n):
            row.append(int(data[idx])); idx += 1
        cost.append(row)
    print(bitmask_dp(n, cost))
