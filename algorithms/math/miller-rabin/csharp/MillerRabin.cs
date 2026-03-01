using System;

public class MillerRabin
{
    public static int Check(int n)
    {
        if (n < 2) return 0;
        if (n < 4) return 1;
        if (n % 2 == 0) return 0;

        int r = 0;
        long d = n - 1;
        while (d % 2 == 0) { r++; d /= 2; }

        int[] witnesses = { 2, 3, 5, 7 };
        foreach (int a in witnesses)
        {
            if (a >= n) continue;

            long x = ModPow(a, d, n);
            if (x == 1 || x == n - 1) continue;

            bool found = false;
            for (int i = 0; i < r - 1; i++)
            {
                x = ModPow(x, 2, n);
                if (x == n - 1) { found = true; break; }
            }

            if (!found) return 0;
        }

        return 1;
    }

    private static long ModPow(long baseVal, long exp, long mod)
    {
        long result = 1;
        baseVal %= mod;
        while (exp > 0)
        {
            if (exp % 2 == 1) result = result * baseVal % mod;
            exp /= 2;
            baseVal = baseVal * baseVal % mod;
        }
        return result;
    }
}
