import bisect


def range_tree(data):
    n = data[0]
    points = sorted(data[1:1 + n])
    lo = data[1 + n]
    hi = data[2 + n]
    left = bisect.bisect_left(points, lo)
    right = bisect.bisect_right(points, hi)
    return right - left


if __name__ == "__main__":
    print(range_tree([5, 1, 3, 5, 7, 9, 2, 6]))
    print(range_tree([4, 2, 4, 6, 8, 1, 10]))
    print(range_tree([3, 1, 2, 3, 10, 20]))
