import java.util.Arrays;

/**
 * Find the contiguous subarray within a one-dimensional array of numbers which has the largest sum.
 * 
 * @author Atom
 *
 */
public class Kadane {
	/**
	 * Find the largest sum of a contiguous subarray using Kadane's algorithm
	 * 
	 * @param arr
	 * @return 
	 * @see <a href="https://en.wikipedia.org/wiki/Maximum_subarray_problem">Maximum subarray problem</a>
	 */
	public static int maxSum(int[] arr) {
		int maxEndingHere = arr[0];
		int maxSoFar = arr[0];
		for (int i = 1; i < arr.length; i++) {
			int x = arr[i];
			maxEndingHere = Math.max(x, maxEndingHere + x);
			maxSoFar = Math.max(maxSoFar, maxEndingHere);
		}
		return maxSoFar;
	}
	
	/**
	 * Find the contiguous subarray which has the largest sum
	 * 
	 * @param arr
	 * @return 
	 * @see <a href="https://en.wikipedia.org/wiki/Maximum_subarray_problem">Maximum subarray problem</a>
	 * @see <a href="https://gist.github.com/arunma/3624849">Kadane.java</a>
	 */
	public static int[] maxSumSubarray(int[] arr) {
		int maxSum = 0;
		int maxStart = 0;
		int maxEnd = 0;
		int sum = 0;
		int start = 0;
		for (int i = 0; i < arr.length; i++) {
			sum += arr[i];
			if (sum <= 0 && arr[i] < 0) { 
				sum = 0;
				start = i + 1; 
			} else if (sum > maxSum) {
				maxSum = sum;
				maxStart = start;
				maxEnd = i + 1;
			}
		}
		return Arrays.copyOfRange(arr, maxStart, maxEnd);
	}
	
	public static void main(String[] args) {
		int[] a = { -2, 1, -3, 4, -1, 2, 1, -5, 4 };	// [4, −1, 2, 1] = 6
		System.out.println("MaxSumSubarray = " + Arrays.toString(maxSumSubarray(a)));
		System.out.println("MaxSum = " + maxSum(a));
		int[] b = {-2, 1, 2, 4, -7, 2, 2, 4, -7, -1, 2, 3};	// [2, 2, 4] = 8, [1, 2, 4, -7, 2, 2, 4] = 8
		System.out.println("MaxSumSubarray = " + Arrays.toString(maxSumSubarray(b)));
		System.out.println("MaxSum = " + maxSum(b));
	}

}
