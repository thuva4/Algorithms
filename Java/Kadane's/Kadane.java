import java.util.Arrays;


public class Kadane {

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

	public static int maxSubArraySum(int a[])
	{
		int size = a.length;
		int max_so_far = Integer.MIN_VALUE, max_ending_here = 0;

		for (int i = 0; i < size; i++)
		{
			max_ending_here = max_ending_here + a[i];
			if (max_so_far < max_ending_here)
				max_so_far = max_ending_here;
			if (max_ending_here < 0)
				max_ending_here = 0;
		}
		return max_so_far;
	}
	public static void main(String[] args) {
		int[] a = { -2, 1, -3, 4, -1, 2, 1, -5, 4 };	// [4, −1, 2, 1] = 6
		System.out.println("MaxSumSubarray = " + Arrays.toString(maxSumSubarray(a)));
		System.out.println("MaxSum = " + maxSum(a));
		System.out.println("MaxSumSubarray = " + maxSubArraySum(a));
		int[] b = {-2, 1, 2, 4, -7, 2, 2, 4, -7, -1, 2, 3};	// [2, 2, 4] = 8, [1, 2, 4, -7, 2, 2, 4] = 8
		System.out.println("MaxSumSubarray = " + Arrays.toString(maxSumSubarray(b)));
		System.out.println("MaxSum = " + maxSum(b));
	}

}
