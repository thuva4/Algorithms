using System;
using System.Linq;

public class ActivitySelection
{
    public static int Select(int[] arr)
    {
        int n = arr.Length / 2;
        if (n == 0)
        {
            return 0;
        }

        var activities = new (int start, int finish)[n];
        for (int i = 0; i < n; i++)
        {
            activities[i] = (arr[2 * i], arr[2 * i + 1]);
        }

        Array.Sort(activities, (a, b) => a.finish.CompareTo(b.finish));

        int count = 1;
        int lastFinish = activities[0].finish;

        for (int i = 1; i < n; i++)
        {
            if (activities[i].start >= lastFinish)
            {
                count++;
                lastFinish = activities[i].finish;
            }
        }

        return count;
    }
}
