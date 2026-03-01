using System;

public class IntegerSqrt
{
    public static int Solve(int[] arr)
    {
        long n = arr[0];
        if (n <= 1) return (int)n;
        long x = n;
        while (true)
        {
            long x1 = (x + n / x) / 2;
            if (x1 >= x) return (int)x;
            x = x1;
        }
    }
}
