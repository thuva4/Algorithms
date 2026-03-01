using System;

namespace Algorithms.Searching.ExponentialSearch
{
    public class ExponentialSearch
    {
        public static int Search(int[] arr, int target)
        {
            if (arr == null || arr.Length == 0) return -1;
            if (arr[0] == target) return 0;

            int i = 1;
            while (i < arr.Length && arr[i] <= target)
                i = i * 2;

            return BinarySearch(arr, i / 2, Math.Min(i, arr.Length - 1), target);
        }

        private static int BinarySearch(int[] arr, int l, int r, int target)
        {
            while (l <= r)
            {
                int mid = l + (r - l) / 2;
                if (arr[mid] == target)
                    return mid;
                if (arr[mid] < target)
                    l = mid + 1;
                else
                    r = mid - 1;
            }
            return -1;
        }
    }
}
