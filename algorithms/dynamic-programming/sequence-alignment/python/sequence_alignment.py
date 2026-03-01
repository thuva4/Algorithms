GAP_COST = 4
MISMATCH_COST = 3


def sequence_alignment(s1, s2):
    m = len(s1)
    n = len(s2)

    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m + 1):
        dp[i][0] = i * GAP_COST
    for j in range(n + 1):
        dp[0][j] = j * GAP_COST

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            match_cost = 0 if s1[i - 1] == s2[j - 1] else MISMATCH_COST
            dp[i][j] = min(
                dp[i - 1][j - 1] + match_cost,
                dp[i - 1][j] + GAP_COST,
                dp[i][j - 1] + GAP_COST
            )

    return dp[m][n]


if __name__ == "__main__":
    print(sequence_alignment("GCCCTAGCG", "GCGCAATG"))  # 18
