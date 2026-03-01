using System;
using System.Collections.Generic;
using System.Linq;

namespace Algorithms.Sorting.Bucket
{
    /**
     * Bucket Sort implementation.
     * Divides the input into several buckets, each of which is then sorted individually.
     */
    public static class BucketSort
    {
        public static int[] Sort(int[] arr)
        {
            if (arr == null || arr.Length <= 1)
            {
                return arr == null ? new int[0] : (int[])arr.Clone();
            }

            int n = arr.Length;
            int min = arr[0];
            int max = arr[0];

            for (int i = 1; i < n; i++)
            {
                if (arr[i] < min) min = arr[i];
                if (arr[i] > max) max = arr[i];
            }

            if (min == max)
            {
                return (int[])arr.Clone();
            }

            // Initialize buckets
            List<int>[] buckets = new List<int>[n];
            for (int i = 0; i < n; i++)
            {
                buckets[i] = new List<int>();
            }

            long range = (long)max - min;

            // Distribute elements into buckets
            foreach (int x in arr)
            {
                int index = (int)((long)(x - min) * (n - 1) / range);
                buckets[index].Add(x);
            }

            // Sort each bucket and merge
            int[] result = new int[n];
            int k = 0;
            for (int i = 0; i < n; i++)
            {
                if (buckets[i].Count > 0)
                {
                    buckets[i].Sort();
                    foreach (int x in buckets[i])
                    {
                        result[k++] = x;
                    }
                }
            }

            return result;
        }
    }
}
