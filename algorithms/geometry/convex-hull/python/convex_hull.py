def convex_hull_count(arr: list[int]) -> int:
    n = arr[0]
    if n <= 2:
        return n

    points: list[tuple[int, int]] = []
    idx = 1
    for _ in range(n):
        points.append((arr[idx], arr[idx + 1]))
        idx += 2

    points.sort()

    def cross(o: tuple[int, int], a: tuple[int, int], b: tuple[int, int]) -> int:
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lower: list[tuple[int, int]] = []
    for p in points:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)

    upper: list[tuple[int, int]] = []
    for p in reversed(points):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)

    hull = lower[:-1] + upper[:-1]
    return len(hull)
