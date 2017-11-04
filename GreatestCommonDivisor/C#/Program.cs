using System;

namespace C_
{
    class Program
    {
        static int EuclideanGCD(int a, int b)
        {
            while (b != 0)
            {
                var temp = b;
                b = a % b;
                a = temp;
            }
            return a;
        }

        static void Main(string[] args)
        {
            var rnd = new Random();

            Console.WriteLine($"a: 10, b: 5, gcd: {EuclideanGCD(10,5)}");
            Console.WriteLine($"a: 5, b: 10, gcd: {EuclideanGCD(5,10)}");
            Console.WriteLine($"a: 7, b: 11, gcd: {EuclideanGCD(7,11)}");
            Console.WriteLine($"a: 5000, b: 1200, gcd: {EuclideanGCD(5000,1200)}");

            for (var i = 0; i < 3; i++)
            {
                var a = rnd.Next(1, 9999);
                var b = rnd.Next(1, 9999);
                Console.WriteLine($"a: {a}, b: {b}, gcd: {EuclideanGCD(a,b)}");
            }
        }
    }
}
