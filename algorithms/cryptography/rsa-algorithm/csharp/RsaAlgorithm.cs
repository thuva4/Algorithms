using System;

public class RsaAlgorithm
{
    static long ModPow(long b, long exp, long mod) {
        long result = 1; b %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) result = result * b % mod;
            exp >>= 1; b = b * b % mod;
        }
        return result;
    }

    static long ExtGcd(long a, long b, out long x, out long y) {
        if (a == 0) { x = 0; y = 1; return b; }
        long x1, y1;
        long g = ExtGcd(b % a, a, out x1, out y1);
        x = y1 - (b / a) * x1;
        y = x1;
        return g;
    }

    static long ModInverse(long e, long phi) {
        long x, y;
        ExtGcd(e % phi, phi, out x, out y);
        return ((x % phi) + phi) % phi;
    }

    public static long Solve(long p, long q, long e, long message) {
        long n = p * q;
        long phi = (p - 1) * (q - 1);
        long d = ModInverse(e, phi);
        long cipher = ModPow(message, e, n);
        return ModPow(cipher, d, n);
    }

    public static void Main(string[] args) {
        Console.WriteLine(Solve(61, 53, 17, 65));
        Console.WriteLine(Solve(61, 53, 17, 42));
        Console.WriteLine(Solve(11, 13, 7, 9));
    }
}
