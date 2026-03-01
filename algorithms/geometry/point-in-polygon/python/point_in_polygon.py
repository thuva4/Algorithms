def point_in_polygon(arr: list[int]) -> int:
    px, py = arr[0], arr[1]
    n = arr[2]
    polygon = [(arr[3 + 2 * i], arr[3 + 2 * i + 1]) for i in range(n)]

    inside = False
    j = n - 1
    for i in range(n):
        xi, yi = polygon[i]
        xj, yj = polygon[j]
        if ((yi > py) != (yj > py)) and (px < (xj - xi) * (py - yi) / (yj - yi) + xi):
            inside = not inside
        j = i

    return 1 if inside else 0
