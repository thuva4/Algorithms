import heapq

def partial_sort(arr: list[int], k: int) -> list[int]:
    """
    Partial Sort implementation.
    Returns the smallest k elements of the array in sorted order.
    If k >= len(arr), returns the fully sorted array.
    """
    if k <= 0:
        return []
    if k >= len(arr):
        return sorted(arr)
    
    return heapq.nsmallest(k, arr)
