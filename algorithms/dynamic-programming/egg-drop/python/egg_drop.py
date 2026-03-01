def egg_drop(arr: list[int]) -> int:
    eggs, floors = arr[0], arr[1]
    dp = [[0] * (floors + 1) for _ in range(eggs + 1)]
    for f in range(1, floors + 1):
        dp[1][f] = f
    for e in range(2, eggs + 1):
        for f in range(1, floors + 1):
            dp[e][f] = float('inf')
            for x in range(1, f + 1):
                worst = 1 + max(dp[e - 1][x - 1], dp[e][f - x])
                dp[e][f] = min(dp[e][f], worst)
    return dp[eggs][floors]
