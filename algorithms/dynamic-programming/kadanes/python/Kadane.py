def kadane(array_of_integers: list[int]) -> int:
    if not array_of_integers:
        return 0
    best = current = array_of_integers[0]
    for value in array_of_integers[1:]:
        current = max(value, current + value)
        best = max(best, current)
    return best
