using System;

public class LongestBitonicSubsequence
{
    public static int Solve(int[] arr)
    {
        int n = arr.Length;
        if (n == 0) return 0;

        int[] lis = new int[n];
        int[] lds = new int[n];
        for (int i = 0; i < n; i++) { lis[i] = 1; lds[i] = 1; }

        for (int i = 1; i < n; i++)
            for (int j = 0; j < i; j++)
                if (arr[j] < arr[i] && lis[j] + 1 > lis[i])
                    lis[i] = lis[j] + 1;

        for (int i = n - 2; i >= 0; i--)
            for (int j = n - 1; j > i; j--)
                if (arr[j] < arr[i] && lds[j] + 1 > lds[i])
                    lds[i] = lds[j] + 1;

        int result = 0;
        for (int i = 0; i < n; i++)
            result = Math.Max(result, lis[i] + lds[i] - 1);

        return result;
    }

    static void Main(string[] args)
    {
        int[] arr = { 1, 3, 4, 2, 6, 1 };
        Console.WriteLine(Solve(arr)); // 5
    }
}
