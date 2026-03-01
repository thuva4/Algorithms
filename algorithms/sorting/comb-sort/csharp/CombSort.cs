using System;

namespace Algorithms.Sorting.Comb
{
    /**
     * Comb Sort implementation.
     * Improves on Bubble Sort by using a gap larger than 1.
     * The gap starts with a large value and shrinks by a factor of 1.3 in every iteration until it reaches 1.
     */
    public static class CombSort
    {
        public static int[] Sort(int[] arr)
        {
            if (arr == null)
            {
                return new int[0];
            }

            int[] result = (int[])arr.Clone();
            int n = result.Length;
            int gap = n;
            double shrink = 1.3;
            bool sorted = false;

            while (!sorted)
            {
                gap = (int)Math.Floor(gap / shrink);
                if (gap <= 1)
                {
                    gap = 1;
                    sorted = true;
                }

                for (int i = 0; i < n - gap; i++)
                {
                    if (result[i] > result[i + gap])
                    {
                        int temp = result[i];
                        result[i] = result[i + gap];
                        result[i + gap] = temp;
                        sorted = false;
                    }
                }
            }

            return result;
        }
    }
}
