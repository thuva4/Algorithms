def job_scheduling(arr: list[int]) -> int:
    n = arr[0]
    jobs = [(arr[1 + 2 * i], arr[1 + 2 * i + 1]) for i in range(n)]

    # Sort by profit descending
    jobs.sort(key=lambda x: -x[1])

    max_deadline = max(j[0] for j in jobs)
    slots = [False] * (max_deadline + 1)
    total_profit = 0

    for deadline, profit in jobs:
        for t in range(min(deadline, max_deadline), 0, -1):
            if not slots[t]:
                slots[t] = True
                total_profit += profit
                break

    return total_profit
