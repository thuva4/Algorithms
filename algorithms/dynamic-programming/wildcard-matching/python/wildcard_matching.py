def wildcard_matching(arr):
    """
    Match text against pattern with wildcards.
    0 = '*' (match any sequence), -1 = '?' (match single), positive = literal.

    Input: [text_len, ...text, pattern_len, ...pattern]
    Returns: 1 if matches, 0 otherwise
    """
    idx = 0
    tlen = arr[idx]; idx += 1
    text = arr[idx:idx + tlen]; idx += tlen
    plen = arr[idx]; idx += 1
    pattern = arr[idx:idx + plen]

    # dp[i][j] = does text[0..i-1] match pattern[0..j-1]
    dp = [[False] * (plen + 1) for _ in range(tlen + 1)]
    dp[0][0] = True

    for j in range(1, plen + 1):
        if pattern[j - 1] == 0:  # '*'
            dp[0][j] = dp[0][j - 1]

    for i in range(1, tlen + 1):
        for j in range(1, plen + 1):
            if pattern[j - 1] == 0:  # '*'
                dp[i][j] = dp[i - 1][j] or dp[i][j - 1]
            elif pattern[j - 1] == -1 or pattern[j - 1] == text[i - 1]:  # '?' or exact
                dp[i][j] = dp[i - 1][j - 1]

    return 1 if dp[tlen][plen] else 0


if __name__ == "__main__":
    print(wildcard_matching([3, 1, 2, 3, 3, 1, 2, 3]))     # 1
    print(wildcard_matching([3, 1, 2, 3, 1, 0]))             # 1
    print(wildcard_matching([3, 1, 2, 3, 3, 1, -1, 3]))     # 1
    print(wildcard_matching([2, 1, 2, 2, 3, 4]))             # 0
    print(wildcard_matching([0, 1, 0]))                       # 1
