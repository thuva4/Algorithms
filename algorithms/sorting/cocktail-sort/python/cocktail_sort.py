def cocktail_sort(arr: list[int]) -> list[int]:
    """
    Cocktail Sort (Bidirectional Bubble Sort) implementation.
    Repeatedly steps through the list in both directions, comparing adjacent elements 
    and swapping them if they are in the wrong order.
    """
    result = list(arr)
    n = len(result)
    if n <= 1:
        return result

    start = 0
    end = n - 1
    swapped = True

    while swapped:
        swapped = False

        # Forward pass (like bubble sort)
        for i in range(start, end):
            if result[i] > result[i + 1]:
                result[i], result[i + 1] = result[i + 1], result[i]
                swapped = True

        if not swapped:
            break

        swapped = False
        # Last element is now in place
        end -= 1

        # Backward pass
        for i in range(end - 1, start - 1, -1):
            if result[i] > result[i + 1]:
                result[i], result[i + 1] = result[i + 1], result[i]
                swapped = True

        # First element is now in place
        start += 1

    return result
