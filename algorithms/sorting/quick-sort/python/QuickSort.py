def quicksort(array, startIndex, endIndex):
    if startIndex < endIndex:
        middle = partition(array, startIndex, endIndex)
        quicksort(array, startIndex, middle - 1)
        quicksort(array, middle + 1, endIndex)
    return array

def partition(array, startIndex, endIndex):
    pivot = startIndex + (endIndex - startIndex) // 2;
    pivotIndex = startIndex
    array[pivot], array[endIndex] = array[endIndex], array[pivot]

    for i in range(startIndex, endIndex):
        if array[i] < array[endIndex]:
            array[pivotIndex], array[i] = array[i], array[pivotIndex]
            pivotIndex += 1

    array[endIndex], array[pivotIndex] = array[pivotIndex], array[endIndex]
    return pivotIndex

if __name__ == '__main__':
    arr = [97, 200, 100, 101, 211, 107]
    print("My array is:\n", [x for x in arr])
    print("\nMy sorted array is: ")
    print(quicksort(arr, 0, len(arr) - 1))
