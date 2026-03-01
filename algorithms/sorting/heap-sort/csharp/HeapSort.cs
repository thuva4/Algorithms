using System;

namespace Algorithms.Sorting.Heap
{
    /**
     * Heap Sort implementation.
     * Sorts an array by first building a max heap, then repeatedly extracting the maximum element.
     */
    public static class HeapSort
    {
        public static int[] Sort(int[] arr)
        {
            if (arr == null)
            {
                return new int[0];
            }

            int[] result = (int[])arr.Clone();
            int n = result.Length;

            // Build max heap
            for (int i = n / 2 - 1; i >= 0; i--)
            {
                Heapify(result, n, i);
            }

            // Extract elements
            for (int i = n - 1; i > 0; i--)
            {
                int temp = result[0];
                result[0] = result[i];
                result[i] = temp;

                Heapify(result, i, 0);
            }

            return result;
        }

        private static void Heapify(int[] arr, int n, int i)
        {
            int largest = i;
            int l = 2 * i + 1;
            int r = 2 * i + 2;

            if (l < n && arr[l] > arr[largest])
            {
                largest = l;
            }

            if (r < n && arr[r] > arr[largest])
            {
                largest = r;
            }

            if (largest != i)
            {
                int swap = arr[i];
                arr[i] = arr[largest];
                arr[largest] = swap;

                Heapify(arr, n, largest);
            }
        }
    }
}
