using System;

class Factorial
{
    static long ComputeFactorial(int n)
    {
        long result = 1;
        for (int i = 2; i <= n; i++)
        {
            result *= i;
        }
        return result;
    }

    static void Main(string[] args)
    {
        Console.WriteLine("5! = " + ComputeFactorial(5));
        Console.WriteLine("10! = " + ComputeFactorial(10));
        Console.WriteLine("0! = " + ComputeFactorial(0));
    }
}
