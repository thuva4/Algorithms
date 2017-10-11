def selection_sort(array):
    """
        Selection sort sorts an array by placing the minimum element element
        at the beginning of an unsorted array.
        :param array A given array
        :return the given array sorted
    """

    length = len(array)

    for i in range(0, length):
        min_index = i # Suppose that the first (current) element is the minimum of the unsorted array

        for j in range(i+1, length):
            # Update min_index when a smaller minimum is found
            if array[j] < array[min_index]:
                min_index = j

        if min_index != i:
            # Swap the minimum and the initial minimum positions
            array[min_index], array[i] = array[i], array[min_index]

    return array

# Example:
if __name__ == '__main__':
    example_array = [5, 6, 7, 8, 1, 2, 12, 14]
    print(example_array)
    print(selection_sort(example_array))
