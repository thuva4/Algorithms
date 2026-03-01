def delaunay_triangulation(arr: list[int]) -> int:
    n = arr[0]
    points = [(arr[1 + 2 * i], arr[1 + 2 * i + 1]) for i in range(n)]

    if n < 3:
        return 0
    unique_points = sorted(set(points))
    if len(unique_points) < 3:
        return 0

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lower = []
    for point in unique_points:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], point) <= 0:
            lower.pop()
        lower.append(point)
    upper = []
    for point in reversed(unique_points):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], point) <= 0:
            upper.pop()
        upper.append(point)

    hull = lower[:-1] + upper[:-1]
    hull_size = len(hull)
    return max(0, 2 * len(unique_points) - 2 - hull_size)
