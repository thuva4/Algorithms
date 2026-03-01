def longest_palindrome_length(arr: list[int]) -> int:
    if len(arr) == 0:
        return 0

    # Transform: insert -1 as sentinel between elements and at boundaries
    t = [-1]
    for x in arr:
        t.append(x)
        t.append(-1)

    n = len(t)
    p = [0] * n
    c = 0
    r = 0
    max_len = 0

    for i in range(n):
        mirror = 2 * c - i
        if i < r:
            p[i] = min(r - i, p[mirror])
        while i + p[i] + 1 < n and i - p[i] - 1 >= 0 and t[i + p[i] + 1] == t[i - p[i] - 1]:
            p[i] += 1
        if i + p[i] > r:
            c = i
            r = i + p[i]
        if p[i] > max_len:
            max_len = p[i]

    return max_len
