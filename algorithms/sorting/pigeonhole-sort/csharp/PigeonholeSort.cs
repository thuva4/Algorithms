using System;
using System.Collections.Generic;
using System.Linq;

namespace Algorithms.Sorting.Pigeonhole
{
    /**
     * Pigeonhole Sort implementation.
     * Efficient for sorting lists of integers where the number of elements is roughly the same as the number of possible key values.
     */
    public static class PigeonholeSort
    {
        public static int[] Sort(int[] arr)
        {
            if (arr == null || arr.Length == 0)
            {
                return new int[0];
            }

            int minVal = arr.Min();
            int maxVal = arr.Max();
            int range = maxVal - minVal + 1;

            List<int>[] holes = new List<int>[range];
            for (int i = 0; i < range; i++)
            {
                holes[i] = new List<int>();
            }

            foreach (int x in arr)
            {
                holes[x - minVal].Add(x);
            }

            int[] result = new int[arr.Length];
            int index = 0;
            foreach (var hole in holes)
            {
                foreach (int val in hole)
                {
                    result[index++] = val;
                }
            }

            return result;
        }
    }
}
