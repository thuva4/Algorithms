using System;

namespace Algorithms.Sorting.Gnome
{
    /**
     * Gnome Sort implementation.
     * A sorting algorithm which is similar to insertion sort in that it works with one item at a time
     * but gets the item to the proper place by a series of swaps, similar to a bubble sort.
     */
    public static class GnomeSort
    {
        public static int[] Sort(int[] arr)
        {
            if (arr == null)
            {
                return new int[0];
            }

            int[] result = (int[])arr.Clone();
            int n = result.Length;
            int index = 0;

            while (index < n)
            {
                if (index == 0)
                {
                    index++;
                }
                if (result[index] >= result[index - 1])
                {
                    index++;
                }
                else
                {
                    int temp = result[index];
                    result[index] = result[index - 1];
                    result[index - 1] = temp;
                    index--;
                }
            }

            return result;
        }
    }
}
