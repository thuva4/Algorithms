def convex_hull_jarvis(arr: list[int]) -> int:
    n = arr[0]
    if n < 2:
        return n

    points = [(arr[1 + 2 * i], arr[1 + 2 * i + 1]) for i in range(n)]

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    def dist_sq(a, b):
        return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2

    # Find leftmost point
    start = 0
    for i in range(1, n):
        if points[i][0] < points[start][0] or (points[i][0] == points[start][0] and points[i][1] < points[start][1]):
            start = i

    hull = []
    current = start
    while True:
        hull.append(current)
        candidate = 0
        for i in range(1, n):
            if i == current:
                continue
            if candidate == current:
                candidate = i
                continue
            c = cross(points[current], points[candidate], points[i])
            if c < 0:
                candidate = i
            elif c == 0:
                if dist_sq(points[current], points[i]) > dist_sq(points[current], points[candidate]):
                    candidate = i

        current = candidate
        if current == start:
            break

    return len(hull)
