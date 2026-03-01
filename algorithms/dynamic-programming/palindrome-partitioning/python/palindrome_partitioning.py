def palindrome_partitioning(arr):
    """
    Find minimum cuts to partition array into palindromic parts.
    Returns: minimum number of cuts
    """
    n = len(arr)
    if n <= 1:
        return 0

    # is_pal[i][j] = True if arr[i..j] is a palindrome
    is_pal = [[False] * n for _ in range(n)]
    for i in range(n):
        is_pal[i][i] = True
    for i in range(n - 1):
        is_pal[i][i + 1] = (arr[i] == arr[i + 1])
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            is_pal[i][j] = (arr[i] == arr[j]) and is_pal[i + 1][j - 1]

    # cuts[i] = min cuts for arr[0..i]
    cuts = [0] * n
    for i in range(n):
        if is_pal[0][i]:
            cuts[i] = 0
        else:
            cuts[i] = i  # worst case: cut each element
            for j in range(1, i + 1):
                if is_pal[j][i]:
                    cuts[i] = min(cuts[i], cuts[j - 1] + 1)

    return cuts[n - 1]


if __name__ == "__main__":
    print(palindrome_partitioning([1, 2, 1]))     # 0
    print(palindrome_partitioning([1, 2, 3, 2]))   # 1
    print(palindrome_partitioning([1, 2, 3]))       # 2
    print(palindrome_partitioning([5]))             # 0
