def flip(arr: list[int], k: int) -> None:
    left = 0
    while left < k:
        arr[left], arr[k] = arr[k], arr[left]
        left += 1
        k -= 1


def pancake_sort(arr: list[int]) -> list[int]:
    """
    Pancake Sort implementation.
    Sorts the array by repeatedly flipping subarrays.
    """
    result = list(arr)
    n = len(result)

    curr_size = n
    while curr_size > 1:
        mi = result.index(max(result[:curr_size]))

        if mi != curr_size - 1:
            flip(result, mi)
            flip(result, curr_size - 1)

        curr_size -= 1

    return result
