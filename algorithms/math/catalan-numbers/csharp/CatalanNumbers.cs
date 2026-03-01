using System;

public class CatalanNumbers
{
    private const long MOD = 1000000007;

    public static int Compute(int n)
    {
        long result = 1;
        for (int i = 1; i <= n; i++)
        {
            result = result * (2L * (2 * i - 1)) % MOD;
            result = result * ModInv(i + 1, MOD) % MOD;
        }
        return (int)result;
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

    private static long ModInv(long a, long mod)
    {
        return ModPow(a, mod - 2, mod);
    }
}
