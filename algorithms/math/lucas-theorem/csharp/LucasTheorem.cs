using System;

public class LucasTheorem
{
    static long ModPow(long b, long exp, long mod) {
        long result = 1; b %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) result = result * b % mod;
            exp >>= 1; b = b * b % mod;
        }
        return result;
    }

    public static int Solve(long n, long k, int p) {
        if (k > n) return 0;
        long pp = p;
        long[] fact = new long[p];
        fact[0] = 1;
        for (int i = 1; i < p; i++) fact[i] = fact[i - 1] * i % pp;

        long result = 1;
        while (n > 0 || k > 0) {
            int ni = (int)(n % pp), ki = (int)(k % pp);
            if (ki > ni) return 0;
            long c = fact[ni] * ModPow(fact[ki], pp - 2, pp) % pp * ModPow(fact[ni - ki], pp - 2, pp) % pp;
            result = result * c % pp;
            n /= pp; k /= pp;
        }
        return (int)result;
    }

    public static void Main(string[] args) {
        Console.WriteLine(Solve(10, 3, 7));
        Console.WriteLine(Solve(5, 2, 3));
        Console.WriteLine(Solve(100, 50, 13));
    }
}
