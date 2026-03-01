def gnome_sort(arr: list[int]) -> list[int]:
    """
    Gnome Sort implementation.
    A sorting algorithm which is similar to insertion sort in that it works with one item at a time
    but gets the item to the proper place by a series of swaps, similar to a bubble sort.
    """
    result = list(arr)
    n = len(result)
    if n <= 1:
        return result
    index = 0

    while index < n:
        if index == 0:
            index += 1
        if result[index] >= result[index - 1]:
            index += 1
        else:
            result[index], result[index - 1] = result[index - 1], result[index]
            index -= 1

    return result
