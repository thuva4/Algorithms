def fractional_knapsack(arr: list[int]) -> int:
    capacity = arr[0]
    n = arr[1]
    items = []
    idx = 2
    for _ in range(n):
        value = arr[idx]
        weight = arr[idx + 1]
        items.append((value, weight))
        idx += 2

    items.sort(key=lambda x: x[0] / x[1], reverse=True)

    total_value = 0.0
    remaining = capacity

    for value, weight in items:
        if remaining <= 0:
            break
        if weight <= remaining:
            total_value += value
            remaining -= weight
        else:
            total_value += value * remaining / weight
            remaining = 0

    return int(total_value * 100)
