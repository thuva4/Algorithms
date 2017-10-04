def insertionSort(inputArray):
	n = len(inputArray)
	for i in range(1,n):
		key = inputArray[i]
		j = i-1

		while (j >= 0 and inputArray[j]>key):
			inputArray[j+1] = inputArray[j]
			j = j - 1
		inputArray[j+1] = key

	return inputArray

