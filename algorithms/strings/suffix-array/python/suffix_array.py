def suffix_array(arr: list[int]) -> list[int]:
    n = len(arr)
    if n == 0:
        return []
    sa = list(range(n))
    rank = arr[:]
    tmp = [0] * n
    k = 1
    while k < n:
        def cmp_key(i):
            return (rank[i], rank[i + k] if i + k < n else -1)
        sa.sort(key=cmp_key)
        tmp[sa[0]] = 0
        for i in range(1, n):
            tmp[sa[i]] = tmp[sa[i - 1]]
            if cmp_key(sa[i]) != cmp_key(sa[i - 1]):
                tmp[sa[i]] += 1
        rank = tmp[:]
        if rank[sa[-1]] == n - 1:
            break
        k *= 2
    return sa
