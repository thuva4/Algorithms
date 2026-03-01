def activity_selection(arr: list[int]) -> int:
    n = len(arr) // 2
    if n == 0:
        return 0

    activities = [(arr[2 * i], arr[2 * i + 1]) for i in range(n)]
    activities.sort(key=lambda a: a[1])

    count = 1
    last_finish = activities[0][1]

    for i in range(1, n):
        if activities[i][0] >= last_finish:
            count += 1
            last_finish = activities[i][1]

    return count
