import sys


def knuth_optimization(n, freq):
    """Compute optimal BST cost using Knuth's optimization."""
    INF = float('inf')
    dp = [[0] * n for _ in range(n)]
    opt = [[0] * n for _ in range(n)]
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + freq[i]

    for i in range(n):
        dp[i][i] = freq[i]
        opt[i][i] = i

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = INF
            cost_sum = prefix[j + 1] - prefix[i]
            lo = opt[i][j - 1]
            hi = opt[i + 1][j] if i + 1 <= j else j
            for k in range(lo, hi + 1):
                left = dp[i][k - 1] if k > i else 0
                right = dp[k + 1][j] if k < j else 0
                val = left + right + cost_sum
                if val < dp[i][j]:
                    dp[i][j] = val
                    opt[i][j] = k

    return dp[0][n - 1]


if __name__ == "__main__":
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    freq = [int(data[idx + i]) for i in range(n)]
    print(knuth_optimization(n, freq))
