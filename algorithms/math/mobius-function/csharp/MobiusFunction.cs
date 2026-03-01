using System;

public class MobiusFunction
{
    public static int MobiusFunctionSum(int n)
    {
        if (n <= 0) return 0;

        int[] mu = new int[n + 1];
        bool[] isComposite = new bool[n + 1];
        for (int i = 1; i <= n; i++)
        {
            mu[i] = 1;
        }
        mu[0] = 0;

        for (int i = 2; i <= n; i++)
        {
            if (!isComposite[i])
            {
                for (int j = i * 2; j <= n; j += i)
                {
                    isComposite[j] = true;
                }

                for (int j = i; j <= n; j += i)
                {
                    mu[j] *= -1;
                }

                long i2 = (long)i * i;
                for (long j = i2; j <= n; j += i2)
                {
                    mu[(int)j] = 0;
                }
            }
        }

        int sum = 0;
        for (int i = 1; i <= n; i++)
        {
            sum += mu[i];
        }
        return sum;
    }

    public static void Main(string[] args)
    {
        Console.WriteLine(MobiusFunctionSum(1));
        Console.WriteLine(MobiusFunctionSum(10));
        Console.WriteLine(MobiusFunctionSum(50));
    }
}
