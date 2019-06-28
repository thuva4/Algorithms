public class binarySearch{
	// inputArray contains the data set we are going to search and it should be sorted
	//x is the number we are going to find inside inputArray
	public static boolean search(int[] inputArray, int x){
		if (x > inputArray[inputArray.length-1] ){
			int mid = inputArray.length/2;

			if (inputArray[mid] == x){
				return true;
			}if (inputArray[mid]>x){
				return search(Arrays.copyOfRange(inputArray,0,mid),x);
			}

			return search(Arrays.copyOfRange(inputArray,mid,inputArray[inputArray.length-1]),x);
		}
	}
}