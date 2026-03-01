def interval_tree(data):
    n = data[0]
    intervals = []
    idx = 1
    for _ in range(n):
        lo, hi = data[idx], data[idx + 1]
        intervals.append((lo, hi))
        idx += 2
    query = data[idx]

    count = 0
    for lo, hi in intervals:
        if lo <= query <= hi:
            count += 1
    return count


if __name__ == "__main__":
    print(interval_tree([3, 1, 5, 3, 8, 6, 10, 4]))
    print(interval_tree([2, 1, 3, 5, 7, 10]))
    print(interval_tree([3, 1, 10, 2, 9, 3, 8, 5]))
