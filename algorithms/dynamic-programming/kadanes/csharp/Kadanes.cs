using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Solution
{
    class Solution
    {
        static long MaxSubArraySum(long[] arr)
        {
            long currentCount = 0;
            long maxCount = Int64.MinValue;
            for (int i = 0; i < arr.Length; i++)
            {
                currentCount += arr[i];
                if (currentCount > maxCount)
                {
                    maxCount = currentCount;
                }
                if (currentCount < 0)
                {
                    currentCount = 0;
                }
            }

            return maxCount;
        }

        static void Main(string[] args)
        {
            long[] arr = { 1, 2, 3,-5,7,8,9};
            long maxSubArraySum = MaxSubArraySum(arr);
            Console.WriteLine(maxSubArraySum);
        }
    }
}
