def line_intersection(arr: list[int]) -> int:
    x1, y1, x2, y2 = arr[0], arr[1], arr[2], arr[3]
    x3, y3, x4, y4 = arr[4], arr[5], arr[6], arr[7]

    def orientation(px, py, qx, qy, rx, ry):
        val = (qy - py) * (rx - qx) - (qx - px) * (ry - qy)
        if val == 0:
            return 0
        return 1 if val > 0 else 2

    def on_segment(px, py, qx, qy, rx, ry):
        return (min(px, rx) <= qx <= max(px, rx) and
                min(py, ry) <= qy <= max(py, ry))

    o1 = orientation(x1, y1, x2, y2, x3, y3)
    o2 = orientation(x1, y1, x2, y2, x4, y4)
    o3 = orientation(x3, y3, x4, y4, x1, y1)
    o4 = orientation(x3, y3, x4, y4, x2, y2)

    if o1 != o2 and o3 != o4:
        return 1

    if o1 == 0 and on_segment(x1, y1, x3, y3, x2, y2):
        return 1
    if o2 == 0 and on_segment(x1, y1, x4, y4, x2, y2):
        return 1
    if o3 == 0 and on_segment(x3, y3, x1, y1, x4, y4):
        return 1
    if o4 == 0 and on_segment(x3, y3, x2, y2, x4, y4):
        return 1

    return 0
