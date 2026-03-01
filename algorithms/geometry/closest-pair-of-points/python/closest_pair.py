def closest_pair(arr: list[int]) -> int:
    n = len(arr) // 2
    points = [(arr[2 * i], arr[2 * i + 1]) for i in range(n)]
    points.sort()

    def dist_sq(p1, p2):
        return (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2

    def strip_closest(strip, d):
        min_d = d
        strip.sort(key=lambda p: p[1])
        for i in range(len(strip)):
            j = i + 1
            while j < len(strip) and (strip[j][1] - strip[i][1]) ** 2 < min_d:
                min_d = min(min_d, dist_sq(strip[i], strip[j]))
                j += 1
        return min_d

    def solve(pts):
        if len(pts) <= 3:
            min_d = float('inf')
            for i in range(len(pts)):
                for j in range(i + 1, len(pts)):
                    min_d = min(min_d, dist_sq(pts[i], pts[j]))
            return min_d

        mid = len(pts) // 2
        mid_x = pts[mid][0]

        dl = solve(pts[:mid])
        dr = solve(pts[mid:])
        d = min(dl, dr)

        strip = [p for p in pts if (p[0] - mid_x) ** 2 < d]
        return min(d, strip_closest(strip, d))

    return solve(points)
