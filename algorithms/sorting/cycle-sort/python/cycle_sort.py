def cycle_sort(arr: list[int]) -> list[int]:
    """
    Cycle Sort implementation.
    An in-place, unstable sorting algorithm that is optimal in terms of
    the number of writes to the original array.
    """
    result = list(arr)
    n = len(result)

    # Traverse array elements to find where they belong
    for cycle_start in range(0, n - 1):
        item = result[cycle_start]

        # Find position where we put the item
        pos = cycle_start
        for i in range(cycle_start + 1, n):
            if result[i] < item:
                pos += 1

        # If item is already in correct position
        if pos == cycle_start:
            continue

        # Ignore all duplicate elements
        while item == result[pos]:
            pos += 1

        # Put the item to its right position
        result[pos], item = item, result[pos]

        # Rotate the rest of the cycle
        while pos != cycle_start:
            pos = cycle_start
            for i in range(cycle_start + 1, n):
                if result[i] < item:
                    pos += 1

            while item == result[pos]:
                pos += 1

            result[pos], item = item, result[pos]

    return result
