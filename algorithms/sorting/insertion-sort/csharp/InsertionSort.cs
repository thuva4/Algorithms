using System;

namespace Algorithms.Sorting.Insertion
{
    /**
     * Insertion Sort implementation.
     * Builds the final sorted array (or list) one item at a time.
     */
    public static class InsertionSort
    {
        public static int[] Sort(int[] arr)
        {
            if (arr == null)
            {
                return new int[0];
            }

            int[] result = (int[])arr.Clone();
            int n = result.Length;

            for (int i = 1; i < n; i++)
            {
                int key = result[i];
                int j = i - 1;

                while (j >= 0 && result[j] > key)
                {
                    result[j + 1] = result[j];
                    j = j - 1;
                }
                result[j + 1] = key;
            }

            return result;
        }
    }
}
