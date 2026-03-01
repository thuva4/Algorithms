using System;
using System.Linq;

namespace Algorithms.Sorting.Counting
{
    /**
     * Counting Sort implementation.
     * Efficient for sorting integers with a known small range.
     */
    public static class CountingSort
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

            int[] count = new int[range];
            int[] output = new int[arr.Length];

            for (int i = 0; i < arr.Length; i++)
            {
                count[arr[i] - minVal]++;
            }

            for (int i = 1; i < range; i++)
            {
                count[i] += count[i - 1];
            }

            for (int i = arr.Length - 1; i >= 0; i--)
            {
                output[count[arr[i] - minVal] - 1] = arr[i];
                count[arr[i] - minVal]--;
            }

            return output;
        }
    }
}
