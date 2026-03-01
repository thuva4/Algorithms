using System;

namespace Algorithms.Sorting.Bubble
{
    /**
     * Bubble Sort implementation.
     * Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.
     * Includes the 'swapped' flag optimization to terminate early if the array is already sorted.
     */
    public static class BubbleSort
    {
        public static int[] Sort(int[] arr)
        {
            if (arr == null || arr.Length <= 1)
            {
                return arr == null ? new int[0] : (int[])arr.Clone();
            }

            // Create a copy of the input array to avoid modifying it
            int[] result = (int[])arr.Clone();
            int n = result.Length;

            for (int i = 0; i < n - 1; i++)
            {
                // Optimization: track if any swaps occurred in this pass
                bool swapped = false;

                // Last i elements are already in place, so we don't need to check them
                for (int j = 0; j < n - i - 1; j++)
                {
                    if (result[j] > result[j + 1])
                    {
                        // Swap elements if they are in the wrong order
                        int temp = result[j];
                        result[j] = result[j + 1];
                        result[j + 1] = temp;
                        swapped = true;
                    }
                }

                // If no two elements were swapped by inner loop, then break
                if (!swapped)
                {
                    break;
                }
            }

            return result;
        }
    }
}
