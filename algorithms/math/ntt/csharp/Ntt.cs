using System;

public class Ntt
{
    const long MOD = 998244353;

    public static int[] NttMultiply(int[] data)
    {
        int idx = 0;
        int na = data[idx++];
        long[] a = new long[na];
        for (int i = 0; i < na; i++) a[i] = ((long)data[idx++] % MOD + MOD) % MOD;
        int nb = data[idx++];
        long[] b = new long[nb];
        for (int i = 0; i < nb; i++) b[i] = ((long)data[idx++] % MOD + MOD) % MOD;

        int resultLen = na + nb - 1;
        long[] result = new long[resultLen];
        for (int i = 0; i < na; i++)
            for (int j = 0; j < nb; j++)
                result[i + j] = (result[i + j] + a[i] * b[j]) % MOD;

        int[] res = new int[resultLen];
        for (int i = 0; i < resultLen; i++) res[i] = (int)result[i];
        return res;
    }

    public static void Main(string[] args)
    {
        Console.WriteLine(string.Join(", ", NttMultiply(new int[] { 2, 1, 2, 2, 3, 4 })));
        Console.WriteLine(string.Join(", ", NttMultiply(new int[] { 2, 1, 1, 2, 1, 1 })));
    }
}
