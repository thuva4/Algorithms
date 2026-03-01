/**
 * Recursive binary search algorithm.
 *  
 * @author Atom
 *
 */
public class BinarySearchRecursive {
	
	/**
	 * A recursive binary search function.
	 * 
	 * @param array Sorted array
	 * @param low
	 * @param high
	 * @param element
	 * @return If found, returns the position of the element in the array, -1 otherwise
	 */
	public static int binarySearch(int[] array, int low, int high, int element) {
		// test final condition
		if (low > high) { return -1; } 
		
		int mid = (high - low) / 2 + low;
		if (element < array[mid]) {
			return binarySearch(array, low, mid - 1, element);
		} else if (element > array[mid]) {
			return binarySearch(array, mid + 1, high, element);
		} else { return mid; }
	}
	
	public static void main(String[] args) {
		// sorted array
		final int[] sortedArray = { -2, -1, 0, 1, 2 };
		
		for (int i = -5; i <= 5; i++) {
			int pos = binarySearch(sortedArray, 0, sortedArray.length - 1, i);
			System.out.println(
					"Searching for item " + i + ": " + (pos == -1 ? "Item not found" : ("Item found at position " + pos)));
		}
	}
	
}
