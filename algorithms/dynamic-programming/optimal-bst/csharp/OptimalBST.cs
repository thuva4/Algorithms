using System;

public class OptimalBST
{
    public static int Compute(int[] arr)
    {
        int n = arr[0];
        int[] freq = new int[n];
        for (int i = 0; i < n; i++) freq[i] = arr[i + 1];

        int[,] cost = new int[n, n];
        for (int i = 0; i < n; i++) cost[i, i] = freq[i];

        for (int len = 2; len <= n; len++)
        {
            for (int i = 0; i <= n - len; i++)
            {
                int j = i + len - 1;
                cost[i, j] = int.MaxValue;
                int freqSum = 0;
                for (int k = i; k <= j; k++) freqSum += freq[k];

                for (int r = i; r <= j; r++)
                {
                    int left = r > i ? cost[i, r - 1] : 0;
                    int right = r < j ? cost[r + 1, j] : 0;
                    int c = left + right + freqSum;
                    if (c < cost[i, j]) cost[i, j] = c;
                }
            }
        }

        return cost[0, n - 1];
    }
}
