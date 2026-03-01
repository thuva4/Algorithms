def counting_sort(arr: list[int]) -> list[int]:
    """
    Counting Sort implementation.
    Efficient for sorting integers with a known small range.
    """
    if not arr:
        return []

    min_val = min(arr)
    max_val = max(arr)
    range_val = max_val - min_val + 1

    count = [0] * range_val
    output = [0] * len(arr)

    # Store count of each character
    for i in range(len(arr)):
        count[arr[i] - min_val] += 1

    # Change count[i] so that count[i] now contains actual
    # position of this character in output array
    for i in range(1, len(count)):
        count[i] += count[i - 1]

    # Build the output character array
    for i in range(len(arr) - 1, -1, -1):
        output[count[arr[i] - min_val] - 1] = arr[i]
        count[arr[i] - min_val] -= 1

    return output
