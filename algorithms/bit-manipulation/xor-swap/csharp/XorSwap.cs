using System;

public static class XorSwap
{
    public static int[] Swap(int a, int b)
    {
        if (a != b)
        {
            a ^= b;
            b ^= a;
            a ^= b;
        }

        return new[] { a, b };
    }

    public static void Main(string[] args)
    {
        Console.WriteLine(string.Join(" ", Swap(5, 10)));
    }
}

