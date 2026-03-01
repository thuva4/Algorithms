def planarity_testing(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    if n <= 4 and m <= 6:
        # For very small graphs, count unique edges
        edges = set()
        for i in range(m):
            u = arr[2 + 2 * i]
            v = arr[2 + 2 * i + 1]
            if u != v:
                edges.add((min(u, v), max(u, v)))
        e = len(edges)
        if n < 3:
            return 1
        return 1 if e <= 3 * n - 6 else 0

    edges = set()
    for i in range(m):
        u = arr[2 + 2 * i]
        v = arr[2 + 2 * i + 1]
        if u != v:
            edges.add((min(u, v), max(u, v)))
    e = len(edges)

    if n < 3:
        return 1
    if e > 3 * n - 6:
        return 0
    return 1
