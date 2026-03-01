using System;

namespace Algorithms.Sorting.Bogo
{
    /**
     * Bogo Sort implementation.
     * Repeatedly shuffles the array until it's sorted.
     * WARNING: Highly inefficient for large arrays.
     */
    public static class BogoSort
    {
        private static readonly Random random = new Random();

        public static int[] Sort(int[] arr)
        {
            if (arr == null || arr.Length <= 1)
            {
                return arr == null ? new int[0] : (int[])arr.Clone();
            }

            int[] result = (int[])arr.Clone();
            while (!IsSorted(result))
            {
                Shuffle(result);
            }
            return result;
        }

        private static bool IsSorted(int[] arr)
        {
            for (int i = 0; i < arr.Length - 1; i++)
            {
                if (arr[i] > arr[i + 1])
                {
                    return false;
                }
            }
            return true;
        }

        private static void Shuffle(int[] arr)
        {
            for (int i = arr.Length - 1; i > 0; i--)
            {
                int j = random.Next(i + 1);
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
}
