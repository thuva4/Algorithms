class InsertionSort{
	public static int[] insertionSort(int[] inputArray){
		int n = inputArray.length;

		for (int i = 1; i < n; i++){
			key = inputArray[i];
			int j = i-1;

			while (j >= 0 && inputArray[j]>key){
				inputArray[j+1] = inputArray[j];
				j = j -1;
			}
			inputArray[j+1] = key;
		}
		return inputArray;
	}
}