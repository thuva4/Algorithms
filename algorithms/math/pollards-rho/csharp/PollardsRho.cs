using System;
using System.Collections.Generic;

public class PollardsRho
{
    static long Gcd(long a, long b) {
        a = Math.Abs(a);
        while (b != 0) { long t = b; b = a % b; a = t; }
        return a;
    }

    static bool IsPrime(long n) {
        if (n < 2) return false;
        if (n < 4) return true;
        if (n % 2 == 0 || n % 3 == 0) return false;
        for (long i = 5; i * i <= n; i += 6)
            if (n % i == 0 || n % (i + 2) == 0) return false;
        return true;
    }

    static long Rho(long n) {
        if (n % 2 == 0) return 2;
        long x = 2, y = 2, c = 1, d = 1;
        while (d == 1) {
            x = (x * x + c) % n;
            y = (y * y + c) % n;
            y = (y * y + c) % n;
            d = Gcd(Math.Abs(x - y), n);
        }
        return d != n ? d : n;
    }

    public static long Solve(long n) {
        if (n <= 1) return n;
        if (IsPrime(n)) return n;
        long smallest = n;
        var stack = new Stack<long>();
        stack.Push(n);
        while (stack.Count > 0) {
            long num = stack.Pop();
            if (num <= 1) continue;
            if (IsPrime(num)) { smallest = Math.Min(smallest, num); continue; }
            long d = Rho(num);
            stack.Push(d);
            stack.Push(num / d);
        }
        return smallest;
    }

    public static void Main(string[] args) {
        Console.WriteLine(Solve(15));
        Console.WriteLine(Solve(13));
        Console.WriteLine(Solve(91));
        Console.WriteLine(Solve(221));
    }
}
