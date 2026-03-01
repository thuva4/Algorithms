using System;

public class MaximumSubarrayDivideConquer
{
    public static long MaxSubarrayDC(int[] arr)
    {
        return Helper(arr, 0, arr.Length - 1);
    }

    private static long Helper(int[] arr, int lo, int hi)
    {
        if (lo == hi) return arr[lo];
        int mid = (lo + hi) / 2;

        long leftSum = long.MinValue, s = 0;
        for (int i = mid; i >= lo; i--) { s += arr[i]; if (s > leftSum) leftSum = s; }
        long rightSum = long.MinValue; s = 0;
        for (int i = mid + 1; i <= hi; i++) { s += arr[i]; if (s > rightSum) rightSum = s; }

        long cross = leftSum + rightSum;
        long leftMax = Helper(arr, lo, mid);
        long rightMax = Helper(arr, mid + 1, hi);
        return Math.Max(Math.Max(leftMax, rightMax), cross);
    }

    public static void Main(string[] args)
    {
        var tokens = Console.ReadLine().Trim().Split();
        int n = int.Parse(tokens[0]);
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = int.Parse(tokens[i + 1]);
        Console.WriteLine(MaxSubarrayDC(arr));
    }
}
