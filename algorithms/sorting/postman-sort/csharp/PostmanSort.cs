using System;
using System.Collections.Generic;
using System.Linq;

namespace Algorithms.Sorting.PostmanSort
{
    public class PostmanSort
    {
        public static void Sort(int[] arr)
        {
            if (arr == null || arr.Length == 0)
                return;

            int minVal = arr.Min();
            int offset = 0;
            
            if (minVal < 0)
            {
                offset = Math.Abs(minVal);
                for (int i = 0; i < arr.Length; i++)
                    arr[i] += offset;
            }

            int maxVal = arr.Max();
            
            for (int exp = 1; maxVal / exp > 0; exp *= 10)
            {
                CountSort(arr, exp);
            }
            
            if (offset > 0)
            {
                for (int i = 0; i < arr.Length; i++)
                    arr[i] -= offset;
            }
        }

        private static void CountSort(int[] arr, int exp)
        {
            int n = arr.Length;
            int[] output = new int[n];
            int[] count = new int[10];

            for (int i = 0; i < n; i++)
                count[(arr[i] / exp) % 10]++;

            for (int i = 1; i < 10; i++)
                count[i] += count[i - 1];

            for (int i = n - 1; i >= 0; i--)
            {
                output[count[(arr[i] / exp) % 10] - 1] = arr[i];
                count[(arr[i] / exp) % 10]--;
            }

            for (int i = 0; i < n; i++)
                arr[i] = output[i];
        }
    }
}
