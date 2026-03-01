def optimal_bst(arr: list[int]) -> int:
    n = arr[0]
    freq = arr[1:n + 1]

    # cost[i][j] = optimal cost for keys i..j
    cost = [[0] * n for _ in range(n)]

    # Base case: single keys
    for i in range(n):
        cost[i][i] = freq[i]

    # Fill for increasing chain lengths
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            cost[i][j] = float('inf')
            freq_sum = sum(freq[i:j + 1])

            for r in range(i, j + 1):
                left = cost[i][r - 1] if r > i else 0
                right = cost[r + 1][j] if r < j else 0
                c = left + right + freq_sum
                if c < cost[i][j]:
                    cost[i][j] = c

    return cost[0][n - 1]
