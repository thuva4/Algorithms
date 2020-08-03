/**
 * Find the kth smallest element in an unordered array.
 * 
 * @author Atom
 * @see <a href="https://en.wikipedia.org/wiki/Quickselect">Quickselect</a>
 */
public class QuickSelect {
	
	/**
	 * Lomuto partition scheme
	 * 
	 * @param arr
	 * @param low
	 * @param high
	 * @return the pivot's final location
	 */
	private static <T extends Comparable<? super T>> int partition(final T[] arr, final int low, final int high) {
		T pivot = arr[high];
		int index = low;
		for (int i = low; i < high; i++) {
			if (arr[i].compareTo(pivot) <= 0) {
				swap(arr, i, index);
				index++;
			}
		}
		swap(arr, index, high);
		return index;
	}
	
	/**
	 * Find the kth smallest element in an unordered array.
	 * 
	 * @param arr
	 * @param kth from 0 to arr.length - 1
	 * @return kth smallest element
	 */
	public static <T extends Comparable<? super T>> T select(final T[] arr, final int kth) {
		if (kth < 0 || kth > arr.length - 1) throw new IllegalArgumentException("elements in the array = " + arr.length + ", kth(0..length-1) = " + kth);
		
		int left = 0;
		int right = arr.length - 1;
		while (right >= left) {
			int pivotIndex = partition(arr, left, right);
			if (kth == pivotIndex) {
				return arr[pivotIndex];
			} else if (kth < pivotIndex) {
				right = pivotIndex - 1;
			} else {
				left = pivotIndex + 1;
			}
		}
		return null;
	}
	
	private static void swap(Object arr[], int i1, int i2) {
		if (i1 == i2) { return; }
		
		Object temp = arr[i1];
		arr[i1] = arr[i2];
		arr[i2] = temp;
	}
	
	public static void main(String[] args) {
		for (int kth = 0; kth < 10; kth++) {
			Integer[] a = { 1, 4, 2, 5, 0, 3, 9, 7, 6, 8 };
			System.out.println("kth(" + kth + ") smallest element = " + select(a, kth));
		}
	}

}
