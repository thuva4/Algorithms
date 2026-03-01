def heapify(arr: list[int], n: int, i: int) -> None:
    largest = i
    l = 2 * i + 1
    r = 2 * i + 2

    if l < n and arr[l] > arr[largest]:
        largest = l

    if r < n and arr[r] > arr[largest]:
        largest = r

    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)


def heap_sort(arr: list[int]) -> list[int]:
    """
    Heap Sort implementation.
    Sorts an array by first building a max heap, then repeatedly extracting the maximum element.
    """
    result = list(arr)
    n = len(result)

    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(result, n, i)

    # Extract elements
    for i in range(n - 1, 0, -1):
        result[i], result[0] = result[0], result[i]
        heapify(result, i, 0)

    return result
