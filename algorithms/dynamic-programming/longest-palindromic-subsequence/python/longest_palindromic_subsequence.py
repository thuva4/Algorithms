def longest_palindromic_subsequence(arr: list[int]) -> int:
    n = len(arr)
    if n == 0:
        return 0
    dp = [[0] * n for _ in range(n)]
    for i in range(n):
        dp[i][i] = 1
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if arr[i] == arr[j]:
                dp[i][j] = dp[i + 1][j - 1] + 2 if length > 2 else 2
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
    return dp[0][n - 1]
