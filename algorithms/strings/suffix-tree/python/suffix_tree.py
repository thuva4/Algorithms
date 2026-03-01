def suffix_tree(arr: list[int]) -> int:
    n = len(arr)
    if n == 0:
        return 0

    # Build suffix array
    sa = list(range(n))
    rank = arr[:]
    tmp = [0] * n
    k = 1
    while k < n:
        def cmp_key(i, r=rank[:], step=k):
            return (r[i], r[i + step] if i + step < n else -1)
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

    # Build LCP array using Kasai's algorithm
    inv_sa = [0] * n
    for i in range(n):
        inv_sa[sa[i]] = i
    lcp = [0] * n
    h = 0
    for i in range(n):
        if inv_sa[i] > 0:
            j = sa[inv_sa[i] - 1]
            while i + h < n and j + h < n and arr[i + h] == arr[j + h]:
                h += 1
            lcp[inv_sa[i]] = h
            if h > 0:
                h -= 1
        else:
            h = 0

    total = n * (n + 1) // 2 - sum(lcp)
    return total
