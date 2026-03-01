import java.util.Scanner;

public class MaximumSubarrayDivideConquer {

    public static long maxSubarrayDC(int[] arr) {
        return helper(arr, 0, arr.length - 1);
    }

    private static long helper(int[] arr, int lo, int hi) {
        if (lo == hi) return arr[lo];
        int mid = (lo + hi) / 2;

        long leftSum = Long.MIN_VALUE, s = 0;
        for (int i = mid; i >= lo; i--) { s += arr[i]; leftSum = Math.max(leftSum, s); }
        long rightSum = Long.MIN_VALUE; s = 0;
        for (int i = mid + 1; i <= hi; i++) { s += arr[i]; rightSum = Math.max(rightSum, s); }

        long cross = leftSum + rightSum;
        long leftMax = helper(arr, lo, mid);
        long rightMax = helper(arr, mid + 1, hi);
        return Math.max(Math.max(leftMax, rightMax), cross);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(maxSubarrayDC(arr));
    }
}
