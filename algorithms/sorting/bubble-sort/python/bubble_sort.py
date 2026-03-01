def bubble_sort(arr: list[int]) -> list[int]:
    """
    Bubble Sort implementation.
    Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.
    Includes the 'swapped' flag optimization to terminate early if the array is already sorted.
    """
    # Create a copy of the input array to avoid modifying it
    result = list(arr)
    n = len(result)

    for i in range(n):
        # Optimization: track if any swaps occurred in this pass
        swapped = False
        
        # Last i elements are already in place, so we don't need to check them
        for j in range(0, n - i - 1):
            if result[j] > result[j + 1]:
                # Swap elements if they are in the wrong order
                result[j], result[j + 1] = result[j + 1], result[j]
                swapped = True
        
        # If no two elements were swapped by inner loop, then break
        if not swapped:
            break

    return result
