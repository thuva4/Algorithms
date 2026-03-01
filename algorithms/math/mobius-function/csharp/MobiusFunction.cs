using System;

public class MobiusFunction
{
    public static int MobiusFunctionSum(int n)
    {
        int[] mu = new int[n + 1];
        mu[1] = 1;
        bool[] isPrime = new bool[n + 1];
        Array.Fill(isPrime, true);

        for (int i = 2; i <= n; i++)
        {
            if (isPrime[i])
            {
                for (int j = i; j <= n; j += i)
                {
                    if (j != i) isPrime[j] = false;
                    mu[j] = -mu[j];
                }
                long i2 = (long)i * i;
                for (long j = i2; j <= n; j += i2)
                    mu[(int)j] = 0;
            }
        }
        int sum = 0;
        for (int i = 1; i <= n; i++) sum += mu[i];
        return sum;
    }

    public static void Main(string[] args)
    {
        Console.WriteLine(MobiusFunctionSum(1));
        Console.WriteLine(MobiusFunctionSum(10));
        Console.WriteLine(MobiusFunctionSum(50));
    }
}
