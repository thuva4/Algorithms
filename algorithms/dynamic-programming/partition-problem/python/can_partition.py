def can_partition(arr: list[int]) -> int:
    total = sum(arr)
    if total % 2 != 0:
        return 0
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for num in arr:
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    return 1 if dp[target] else 0
