#inputArray is the input dataset
#x is the searching integer in the array
def binarySearch(inputArray,x):
	if (inputArray[-1] > x):
		mid = len(inputArray)//2 # get the mid index of the inputArray
		if (inputArray[mid] == x): #check it the with the searching number
			return true 			#if yes return true
		if (inputArray[mid] > x): 
			return binarySearch(inputArray[:mid],x)

		return binarySearch(inputArray[mid:],x)
	else:
		return false
