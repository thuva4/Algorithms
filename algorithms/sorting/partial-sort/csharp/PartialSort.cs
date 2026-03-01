using System;
using System.Collections.Generic;
using System.Linq;

namespace Algorithms.Sorting.Partial
{
    /**
     * Partial Sort implementation.
     * Returns the smallest k elements of the array in sorted order.
     */
    public static class PartialSort
    {
        public static int[] Sort(int[] arr, int k)
        {
            if (arr == null || k <= 0)
            {
                return new int[0];
            }
            if (k >= arr.Length)
            {
                int[] result = (int[])arr.Clone();
                Array.Sort(result);
                return result;
            }

            // A simple implementation using LINQ.
            // For performance-critical scenarios, a heap-based approach would be better.
            return arr.OrderBy(x => x).Take(k).ToArray();
        }
    }
}
