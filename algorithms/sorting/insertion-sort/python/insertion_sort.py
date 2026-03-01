def insertion_sort(arr: list[int]) -> list[int]:
    """
    Insertion Sort implementation.
    Builds the final sorted array (or list) one item at a time.
    """
    result = list(arr)
    n = len(result)

    for i in range(1, n):
        key = result[i]
        j = i - 1
        while j >= 0 and result[j] > key:
            result[j + 1] = result[j]
            j -= 1
        result[j + 1] = key

    return result
