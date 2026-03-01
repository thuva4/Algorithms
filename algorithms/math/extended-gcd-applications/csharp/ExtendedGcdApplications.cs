using System;

public class ExtendedGcdApplications
{
    static (long g, long x, long y) ExtGcd(long a, long b)
    {
        if (a == 0) return (b, 0, 1);
        var (g, x1, y1) = ExtGcd(b % a, a);
        return (g, y1 - (b / a) * x1, x1);
    }

    public static int Solve(int[] arr)
    {
        long a = arr[0], m = arr[1];
        var (g, x, _) = ExtGcd(((a % m) + m) % m, m);
        if (g != 1) return -1;
        return (int)(((x % m) + m) % m);
    }

    static void Main(string[] args)
    {
        Console.WriteLine(Solve(new int[] { 3, 7 }));
        Console.WriteLine(Solve(new int[] { 1, 13 }));
        Console.WriteLine(Solve(new int[] { 6, 9 }));
        Console.WriteLine(Solve(new int[] { 2, 11 }));
    }
}
