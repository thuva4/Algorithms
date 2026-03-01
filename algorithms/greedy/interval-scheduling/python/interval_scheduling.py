def interval_scheduling(arr: list[int]) -> int:
    n = arr[0]
    intervals = [(arr[1 + 2 * i], arr[1 + 2 * i + 1]) for i in range(n)]
    intervals.sort(key=lambda x: x[1])

    count = 0
    last_end = -1

    for start, end in intervals:
        if start >= last_end:
            count += 1
            last_end = end

    return count
