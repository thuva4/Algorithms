using System;
using System.Collections.Generic;

public class DiscreteLogarithm
{
    static long ModPow(long b, long exp, long mod)
    {
        long result = 1; b %= mod;
        while (exp > 0)
        {
            if ((exp & 1) == 1) result = result * b % mod;
            exp >>= 1;
            b = b * b % mod;
        }
        return result;
    }

    public static int Solve(long baseVal, long target, long modulus)
    {
        if (modulus == 1) return 0;
        int m = (int)Math.Ceiling(Math.Sqrt(modulus));
        target %= modulus;

        var table = new Dictionary<long, int>();
        long power = 1;
        for (int j = 0; j < m; j++)
        {
            if (power == target) return j;
            table[power] = j;
            power = power * baseVal % modulus;
        }

        long baseInvM = ModPow(baseVal, modulus - 1 - (m % (modulus - 1)), modulus);
        long gamma = target;
        for (int i = 0; i < m; i++)
        {
            if (table.ContainsKey(gamma)) return i * m + table[gamma];
            gamma = gamma * baseInvM % modulus;
        }
        return -1;
    }

    public static void Main(string[] args)
    {
        Console.WriteLine(Solve(2, 8, 13));
        Console.WriteLine(Solve(5, 1, 7));
        Console.WriteLine(Solve(3, 3, 11));
        Console.WriteLine(Solve(3, 13, 17));
    }
}
