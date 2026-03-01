def max_1d_range_sum(array_of_integers: list[int]) -> int:
    if not array_of_integers:
        return 0
    best = current = 0
    for value in array_of_integers:
        current = max(0, current + value)
        best = max(best, current)
    return best
