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
        target %= modulus;
        long value = 1 % modulus;
        for (int exponent = 0; exponent < modulus; exponent++)
        {
            if (value == target)
            {
                return exponent;
            }
            value = value * (baseVal % modulus) % modulus;
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
