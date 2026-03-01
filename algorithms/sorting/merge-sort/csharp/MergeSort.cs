using System;
using System.Linq;

namespace Algorithms.Sorting.Merge
{
    /**
     * Merge Sort implementation.
     * Sorts an array by recursively dividing it into halves, sorting each half,
     * and then merging the sorted halves.
     */
    public static class MergeSort
    {
        public static int[] Sort(int[] arr)
        {
            if (arr == null)
            {
                return new int[0];
            }
            if (arr.Length <= 1)
            {
                return (int[])arr.Clone();
            }

            int mid = arr.Length / 2;
            int[] left = Sort(arr.Take(mid).ToArray());
            int[] right = Sort(arr.Skip(mid).ToArray());

            return Merge(left, right);
        }

        private static int[] Merge(int[] left, int[] right)
        {
            int[] result = new int[left.Length + right.Length];
            int i = 0, j = 0, k = 0;

            while (i < left.Length && j < right.Length)
            {
                if (left[i] <= right[j])
                {
                    result[k++] = left[i++];
                }
                else
                {
                    result[k++] = right[j++];
                }
            }

            while (i < left.Length)
            {
                result[k++] = left[i++];
            }

            while (j < right.Length)
            {
                result[k++] = right[j++];
            }

            return result;
        }
    }
}
