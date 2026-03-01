def levenshtein_distance(arr):
    """
    Compute the Levenshtein (edit) distance between two sequences.

    Input format: [len1, seq1..., len2, seq2...]
    Returns: minimum number of single-element edits (insert, delete, substitute)
    """
    idx = 0
    len1 = arr[idx]; idx += 1
    seq1 = arr[idx:idx + len1]; idx += len1
    len2 = arr[idx]; idx += 1
    seq2 = arr[idx:idx + len2]; idx += len2

    n = len1
    m = len2

    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if seq1[i - 1] == seq2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])

    return dp[n][m]


if __name__ == "__main__":
    print(levenshtein_distance([3, 1, 2, 3, 3, 1, 2, 4]))  # 1
    print(levenshtein_distance([2, 5, 6, 2, 5, 6]))          # 0
    print(levenshtein_distance([2, 1, 2, 2, 3, 4]))          # 2
    print(levenshtein_distance([0, 3, 1, 2, 3]))             # 3
