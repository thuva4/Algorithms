using System;
using System.Linq;

public class IntervalScheduling
{
    public static int Schedule(int[] arr)
    {
        int n = arr[0];
        var intervals = new (int start, int end)[n];
        for (int i = 0; i < n; i++)
        {
            intervals[i] = (arr[1 + 2 * i], arr[1 + 2 * i + 1]);
        }

        Array.Sort(intervals, (a, b) => a.end.CompareTo(b.end));

        int count = 0;
        int lastEnd = -1;
        foreach (var iv in intervals)
        {
            if (iv.start >= lastEnd)
            {
                count++;
                lastEnd = iv.end;
            }
        }

        return count;
    }
}
