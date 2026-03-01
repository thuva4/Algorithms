def pigeonhole_sort(arr: list[int]) -> list[int]:
    """
    Pigeonhole Sort implementation.
    Efficient for sorting lists of integers where the number of elements is roughly the same as the number of possible key values.
    """
    if len(arr) == 0:
        return []

    min_val = min(arr)
    max_val = max(arr)
    size = max_val - min_val + 1

    holes: list[list[int]] = [[] for _ in range(size)]

    for x in arr:
        holes[x - min_val].append(x)

    result: list[int] = []
    for hole in holes:
        result.extend(hole)

    return result
