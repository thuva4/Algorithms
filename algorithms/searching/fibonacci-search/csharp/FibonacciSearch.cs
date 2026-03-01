using System;

namespace Algorithms.Searching.FibonacciSearch
{
    public class FibonacciSearch
    {
        public static int Search(int[] arr, int target)
        {
            int n = arr.Length;
            if (n == 0) return -1;

            int fibMMm2 = 0;
            int fibMMm1 = 1;
            int fibM = fibMMm2 + fibMMm1;

            while (fibM < n)
            {
                fibMMm2 = fibMMm1;
                fibMMm1 = fibM;
                fibM = fibMMm2 + fibMMm1;
            }

            int offset = -1;

            while (fibM > 1)
            {
                int i = Math.Min(offset + fibMMm2, n - 1);

                if (arr[i] < target)
                {
                    fibM = fibMMm1;
                    fibMMm1 = fibMMm2;
                    fibMMm2 = fibM - fibMMm1;
                    offset = i;
                }
                else if (arr[i] > target)
                {
                    fibM = fibMMm2;
                    fibMMm1 = fibMMm1 - fibMMm2;
                    fibMMm2 = fibM - fibMMm1;
                }
                else
                {
                    return i;
                }
            }

            if (fibMMm1 == 1 && offset + 1 < n && arr[offset + 1] == target)
                return offset + 1;

            return -1;
        }
    }
}
