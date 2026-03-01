using System;

namespace Algorithms.Sorting.Bitonic
{
    /**
     * Bitonic Sort implementation.
     * Works on any array size by padding to the nearest power of 2.
     */
    public static class BitonicSort
    {
        public static int[] Sort(int[] arr)
        {
            if (arr == null || arr.Length == 0)
            {
                return new int[0];
            }

            int n = arr.Length;
            int nextPow2 = 1;
            while (nextPow2 < n)
            {
                nextPow2 *= 2;
            }

            // Pad the array to the next power of 2
            // We use int.MaxValue for padding to handle ascending sort
            int[] padded = new int[nextPow2];
            for (int i = 0; i < n; i++)
            {
                padded[i] = arr[i];
            }
            for (int i = n; i < nextPow2; i++)
            {
                padded[i] = int.MaxValue;
            }

            BitonicSortRecursive(padded, 0, nextPow2, true);

            // Return the first n elements (trimmed back to original size)
            int[] result = new int[n];
            Array.Copy(padded, 0, result, 0, n);
            return result;
        }

        private static void CompareAndSwap(int[] arr, int i, int j, bool ascending)
        {
            if ((ascending && arr[i] > arr[j]) || (!ascending && arr[i] < arr[j]))
            {
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }

        private static void BitonicMerge(int[] arr, int low, int cnt, bool ascending)
        {
            if (cnt > 1)
            {
                int k = cnt / 2;
                for (int i = low; i < low + k; i++)
                {
                    CompareAndSwap(arr, i, i + k, ascending);
                }
                BitonicMerge(arr, low, k, ascending);
                BitonicMerge(arr, low + k, k, ascending);
            }
        }

        private static void BitonicSortRecursive(int[] arr, int low, int cnt, bool ascending)
        {
            if (cnt > 1)
            {
                int k = cnt / 2;
                // Sort first half in ascending order
                BitonicSortRecursive(arr, low, k, true);
                // Sort second half in descending order
                BitonicSortRecursive(arr, low + k, k, false);
                // Merge the whole sequence in given order
                BitonicMerge(arr, low, cnt, ascending);
            }
        }
    }
}
