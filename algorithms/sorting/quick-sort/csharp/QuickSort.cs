using System;

namespace Algorithms.Sorting.QuickSort
{
    public class QuickSort
    {
        public static void Sort(int[] arr)
        {
            if (arr != null && arr.Length > 0)
            {
                Sort(arr, 0, arr.Length - 1);
            }
        }

        private static void Sort(int[] arr, int low, int high)
        {
            if (low < high)
            {
                int pi = Partition(arr, low, high);

                Sort(arr, low, pi - 1);
                Sort(arr, pi + 1, high);
            }
        }

        private static int Partition(int[] arr, int low, int high)
        {
            int pivot = arr[high];
            int i = (low - 1);

            for (int j = low; j < high; j++)
            {
                if (arr[j] < pivot)
                {
                    i++;
                    Swap(arr, i, j);
                }
            }
            Swap(arr, i + 1, high);
            return i + 1;
        }

        private static void Swap(int[] arr, int i, int j)
        {
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
}
