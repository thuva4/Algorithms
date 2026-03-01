import math

def bitonic_sort(arr: list[int]) -> list[int]:
    """
    Bitonic Sort implementation.
    Works on any array size by padding to the nearest power of 2.
    """
    if not arr:
        return []

    # Pad the array to the next power of 2
    n = len(arr)
    next_pow2 = 1 if n == 0 else 2**(n - 1).bit_length()
    
    # We use float('inf') for padding to handle ascending sort
    padded = [float('inf')] * next_pow2
    for i in range(n):
        padded[i] = arr[i]

    def compare_and_swap(i: int, j: int, ascending: bool):
        if (ascending and padded[i] > padded[j]) or (not ascending and padded[i] < padded[j]):
            padded[i], padded[j] = padded[j], padded[i]

    def bitonic_merge(low: int, cnt: int, ascending: bool):
        if cnt > 1:
            k = cnt // 2
            for i in range(low, low + k):
                compare_and_swap(i, i + k, ascending)
            bitonic_merge(low, k, ascending)
            bitonic_merge(low + k, k, ascending)

    def bitonic_sort_recursive(low: int, cnt: int, ascending: bool):
        if cnt > 1:
            k = cnt // 2
            # Sort first half in ascending order
            bitonic_sort_recursive(low, k, True)
            # Sort second half in descending order
            bitonic_sort_recursive(low + k, k, False)
            # Merge the whole sequence in given order
            bitonic_merge(low, cnt, ascending)

    bitonic_sort_recursive(0, next_pow2, True)
    
    # Return the first n elements (trimmed back to original size)
    return [int(x) if x != float('inf') else x for x in padded[:n]]
