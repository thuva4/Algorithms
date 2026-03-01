using System;

public class ModExp
{
    public static int Solve(int[] arr)
    {
        long b = arr[0];
        long exp = arr[1];
        long mod = arr[2];
        if (mod == 1) return 0;
        long result = 1;
        b %= mod;
        while (exp > 0)
        {
            if (exp % 2 == 1) result = (result * b) % mod;
            exp >>= 1;
            b = (b * b) % mod;
        }
        return (int)result;
    }
}
