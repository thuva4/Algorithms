import random

def is_sorted(arr: list[int]) -> bool:
    """Check whether the array is sorted in non-decreasing order."""
    for i in range(len(arr) - 1):
        if arr[i] > arr[i + 1]:
            return False
    return True

def bogo_sort(arr: list[int]) -> list[int]:
    """
    Bogo Sort implementation.
    Repeatedly shuffles the array until it's sorted.
    WARNING: Highly inefficient for large arrays.
    """
    result = arr[:]
    while not is_sorted(result):
        random.shuffle(result)
    return result
