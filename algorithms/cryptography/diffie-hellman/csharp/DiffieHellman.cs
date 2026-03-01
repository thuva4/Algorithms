using System;

class DiffieHellman
{
    static long ModPow(long baseVal, long exp, long mod)
    {
        long result = 1;
        baseVal %= mod;
        while (exp > 0)
        {
            if ((exp & 1) == 1)
                result = (result * baseVal) % mod;
            exp >>= 1;
            baseVal = (baseVal * baseVal) % mod;
        }
        return result;
    }

    static void Main(string[] args)
    {
        long p = 23;
        long g = 5;
        long a = 6;
        long b = 15;

        long A = ModPow(g, a, p);
        Console.WriteLine("Alice sends: " + A);

        long B = ModPow(g, b, p);
        Console.WriteLine("Bob sends: " + B);

        long aliceSecret = ModPow(B, a, p);
        Console.WriteLine("Alice's shared secret: " + aliceSecret);

        long bobSecret = ModPow(A, b, p);
        Console.WriteLine("Bob's shared secret: " + bobSecret);
    }
}
