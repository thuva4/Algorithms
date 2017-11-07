using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Solution
{
    class Solution
    {
        /// <summary>
        /// Returns the GCD of two integers
        /// </summary>
        /// <param name="a"></param>
        /// <param name="b"></param>
        /// <returns></returns>
        static int GCD(int a,int b)
        {
            while (b != 0)
            {
                int temp = a % b;
                a = b;
                b = temp;
            }
            return a;
        }

        static void Main(string[] args)
        {
            int gcd = GCD(12, 30);
            Console.WriteLine(gcd);
        }
    }
}
