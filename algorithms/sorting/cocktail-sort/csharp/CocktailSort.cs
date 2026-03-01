using System;

namespace Algorithms.Sorting.Cocktail
{
    /**
     * Cocktail Sort implementation.
     * Repeatedly steps through the list in both directions, comparing adjacent elements 
     * and swapping them if they are in the wrong order.
     */
    public static class CocktailSort
    {
        public static int[] Sort(int[] arr)
        {
            if (arr == null || arr.Length <= 1)
            {
                return arr == null ? new int[0] : (int[])arr.Clone();
            }

            int[] result = (int[])arr.Clone();
            int n = result.Length;
            int start = 0;
            int end = n - 1;
            bool swapped = true;

            while (swapped)
            {
                swapped = false;

                // Forward pass
                for (int i = start; i < end; i++)
                {
                    if (result[i] > result[i + 1])
                    {
                        int temp = result[i];
                        result[i] = result[i + 1];
                        result[i + 1] = temp;
                        swapped = true;
                    }
                }

                if (!swapped)
                {
                    break;
                }

                swapped = false;
                end--;

                // Backward pass
                for (int i = end - 1; i >= start; i--)
                {
                    if (result[i] > result[i + 1])
                    {
                        int temp = result[i];
                        result[i] = result[i + 1];
                        result[i + 1] = temp;
                        swapped = true;
                    }
                }

                start++;
            }

            return result;
        }
    }
}
