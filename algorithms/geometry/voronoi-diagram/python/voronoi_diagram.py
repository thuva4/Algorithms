def voronoi_diagram(arr: list[int]) -> int:
    n = arr[0]
    points = [(arr[1 + 2 * i], arr[1 + 2 * i + 1]) for i in range(n)]

    if n < 3:
        return 0

    EPS = 1e-9
    vertices = set()

    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                ax, ay = points[i]
                bx, by = points[j]
                cx, cy = points[k]

                d = 2.0 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
                if abs(d) < EPS:
                    continue

                ux = ((ax * ax + ay * ay) * (by - cy) +
                      (bx * bx + by * by) * (cy - ay) +
                      (cx * cx + cy * cy) * (ay - by)) / d
                uy = ((ax * ax + ay * ay) * (cx - bx) +
                      (bx * bx + by * by) * (ax - cx) +
                      (cx * cx + cy * cy) * (bx - ax)) / d

                r_sq = (ux - ax) ** 2 + (uy - ay) ** 2

                valid = True
                for m in range(n):
                    if m == i or m == j or m == k:
                        continue
                    dist_sq = (ux - points[m][0]) ** 2 + (uy - points[m][1]) ** 2
                    if dist_sq < r_sq - EPS:
                        valid = False
                        break

                if valid:
                    rounded = (round(ux * 1000000) / 1000000, round(uy * 1000000) / 1000000)
                    vertices.add(rounded)

    return len(vertices)
