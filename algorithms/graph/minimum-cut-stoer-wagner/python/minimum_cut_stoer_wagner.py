def minimum_cut_stoer_wagner(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    w = [[0] * n for _ in range(n)]
    idx = 2
    for _ in range(m):
        u = arr[idx]; v = arr[idx + 1]; c = arr[idx + 2]
        w[u][v] += c
        w[v][u] += c
        idx += 3

    merged = [False] * n
    best = float('inf')

    for phase in range(n - 1):
        key = [0] * n
        in_a = [False] * n
        prev = -1
        last = -1
        for _ in range(n - phase):
            sel = -1
            for v in range(n):
                if not merged[v] and not in_a[v]:
                    if sel == -1 or key[v] > key[sel]:
                        sel = v
            in_a[sel] = True
            prev = last
            last = sel
            for v in range(n):
                if not merged[v] and not in_a[v]:
                    key[v] += w[sel][v]

        if key[last] < best:
            best = key[last]

        # merge last into prev
        for v in range(n):
            w[prev][v] += w[last][v]
            w[v][prev] += w[v][last]
        merged[last] = True

    return best
