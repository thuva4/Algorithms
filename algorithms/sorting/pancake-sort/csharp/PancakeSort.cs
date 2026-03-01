using System;

namespace Algorithms.Sorting.Pancake
{
    /**
     * Pancake Sort implementation.
     * Sorts the array by repeatedly flipping subarrays.
     */
    public static class PancakeSort
    {
        public static int[] Sort(int[] arr)
        {
            if (arr == null)
            {
                return new int[0];
            }

            int[] result = (int[])arr.Clone();
            int n = result.Length;

            for (int currSize = n; currSize > 1; currSize--)
            {
                int mi = FindMax(result, currSize);

                if (mi != currSize - 1)
                {
                    Flip(result, mi);
                    Flip(result, currSize - 1);
                }
            }

            return result;
        }

        private static void Flip(int[] arr, int k)
        {
            int i = 0;
            while (i < k)
            {
                int temp = arr[i];
                arr[i] = arr[k];
                arr[k] = temp;
                i++;
                k--;
            }
        }

        private static int FindMax(int[] arr, int n)
        {
            int mi = 0;
            for (int i = 0; i < n; i++)
            {
                if (arr[i] > arr[mi])
                {
                    mi = i;
                }
            }
            return mi;
        }
    }
}
