using System;

namespace Algorithms.Searching.JumpSearch
{
    public class JumpSearch
    {
        public static int Search(int[] arr, int target)
        {
            int n = arr.Length;
            if (n == 0) return -1;

            int step = (int)Math.Sqrt(n);
            int prev = 0;

            while (arr[Math.Min(step, n) - 1] < target)
            {
                prev = step;
                step += (int)Math.Sqrt(n);
                if (prev >= n)
                    return -1;
            }

            while (arr[prev] < target)
            {
                prev++;
                if (prev == Math.Min(step, n))
                    return -1;
            }

            if (arr[prev] == target)
                return prev;

            return -1;
        }
    }
}
