using System;

namespace Algorithms.Sorting.Cycle
{
    /**
     * Cycle Sort implementation.
     * An in-place, unstable sorting algorithm that is optimal in terms of
     * the number of writes to the original array.
     */
    public static class CycleSort
    {
        public static int[] Sort(int[] arr)
        {
            if (arr == null)
            {
                return new int[0];
            }

            int[] result = (int[])arr.Clone();
            int n = result.Length;

            for (int cycleStart = 0; cycleStart <= n - 2; cycleStart++)
            {
                int item = result[cycleStart];

                int pos = cycleStart;
                for (int i = cycleStart + 1; i < n; i++)
                {
                    if (result[i] < item)
                    {
                        pos++;
                    }
                }

                if (pos == cycleStart)
                {
                    continue;
                }

                while (item == result[pos])
                {
                    pos++;
                }

                if (pos != cycleStart)
                {
                    int temp = item;
                    item = result[pos];
                    result[pos] = temp;
                }

                while (pos != cycleStart)
                {
                    pos = cycleStart;
                    for (int i = cycleStart + 1; i < n; i++)
                    {
                        if (result[i] < item)
                        {
                            pos++;
                        }
                    }

                    while (item == result[pos])
                    {
                        pos++;
                    }

                    if (item != result[pos])
                    {
                        int temp = item;
                        item = result[pos];
                        result[pos] = temp;
                    }
                }
            }

            return result;
        }
    }
}
