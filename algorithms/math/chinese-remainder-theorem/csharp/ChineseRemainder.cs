using System;

public class ChineseRemainder
{
    public static int Solve(int[] arr)
    {
        int n = arr[0];
        long r = arr[1];
        long m = arr[2];

        for (int i = 1; i < n; i++)
        {
            long r2 = arr[1 + 2 * i];
            long m2 = arr[2 + 2 * i];
            long p, q;
            long g = ExtGcd(m, m2, out p, out q);
            long lcm = m / g * m2;
            r = (r + m * ((r2 - r) / g) * p) % lcm;
            if (r < 0) r += lcm;
            m = lcm;
        }

        return (int)(r % m);
    }

    private static long ExtGcd(long a, long b, out long x, out long y)
    {
        if (a == 0) { x = 0; y = 1; return b; }
        long x1, y1;
        long g = ExtGcd(b % a, a, out x1, out y1);
        x = y1 - (b / a) * x1;
        y = x1;
        return g;
    }
}
