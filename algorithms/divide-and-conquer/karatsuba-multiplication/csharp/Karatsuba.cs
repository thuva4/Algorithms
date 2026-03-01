using System;

public class Karatsuba
{
    public static int Compute(int[] arr)
    {
        return (int)Multiply(arr[0], arr[1]);
    }

    private static long Multiply(long x, long y)
    {
        if (x < 10 || y < 10) return x * y;

        int n = Math.Max(Math.Abs(x).ToString().Length, Math.Abs(y).ToString().Length);
        int half = n / 2;
        long power = (long)Math.Pow(10, half);

        long x1 = x / power, x0 = x % power;
        long y1 = y / power, y0 = y % power;

        long z0 = Multiply(x0, y0);
        long z2 = Multiply(x1, y1);
        long z1 = Multiply(x0 + x1, y0 + y1) - z0 - z2;

        return z2 * power * power + z1 * power + z0;
    }
}
