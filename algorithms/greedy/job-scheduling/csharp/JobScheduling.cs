using System;
using System.Linq;

public class JobScheduling
{
    public static int Schedule(int[] arr)
    {
        int n = arr[0];
        var jobs = new (int deadline, int profit)[n];
        int maxDeadline = 0;

        for (int i = 0; i < n; i++)
        {
            jobs[i] = (arr[1 + 2 * i], arr[1 + 2 * i + 1]);
            maxDeadline = Math.Max(maxDeadline, jobs[i].deadline);
        }

        Array.Sort(jobs, (a, b) => b.profit.CompareTo(a.profit));

        bool[] slots = new bool[maxDeadline + 1];
        int totalProfit = 0;

        foreach (var job in jobs)
        {
            for (int t = Math.Min(job.deadline, maxDeadline); t > 0; t--)
            {
                if (!slots[t])
                {
                    slots[t] = true;
                    totalProfit += job.profit;
                    break;
                }
            }
        }

        return totalProfit;
    }
}
