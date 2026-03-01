using System;

class PrimeCheck
{
    static bool IsPrime(int n)
    {
        if (n <= 1) return false;
        if (n <= 3) return true;
        if (n % 2 == 0 || n % 3 == 0) return false;

        for (int i = 5; i * i <= n; i += 6)
        {
            if (n % i == 0 || n % (i + 2) == 0)
                return false;
        }
        return true;
    }

    static void Main(string[] args)
    {
        Console.WriteLine("2 is prime: " + IsPrime(2));
        Console.WriteLine("4 is prime: " + IsPrime(4));
        Console.WriteLine("97 is prime: " + IsPrime(97));
    }
}
