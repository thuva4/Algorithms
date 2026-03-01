def comb_sort(arr: list[int]) -> list[int]:
    """
    Comb Sort implementation.
    Improves on Bubble Sort by using a gap larger than 1.
    The gap starts with a large value and shrinks by a factor of 1.3 in every iteration until it reaches 1.
    """
    result = list(arr)
    n = len(result)
    gap = n
    shrink = 1.3
    sorted_flag = False

    while not sorted_flag:
        # Update the gap value for a next comb
        gap = int(gap / shrink)
        if gap <= 1:
            gap = 1
            sorted_flag = True

        # A single "comb" over the input list
        for i in range(n - gap):
            if result[i] > result[i + gap]:
                result[i], result[i + gap] = result[i + gap], result[i]
                sorted_flag = False

    return result
