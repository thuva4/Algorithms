using System;
using System.Collections.Generic;
using System.Linq;

public class ConvexHullTrick
{
    static bool Bad(long m1, long b1, long m2, long b2, long m3, long b3)
    {
        return (double)(b3 - b1) * (m1 - m2) <= (double)(b2 - b1) * (m1 - m3);
    }

    public static long[] Solve(long[][] lines, long[] queries)
    {
        Array.Sort(lines, (a, b) => a[0].CompareTo(b[0]));
        var hull = new List<long[]>();
        foreach (var line in lines)
        {
            while (hull.Count >= 2 &&
                   Bad(hull[hull.Count - 2][0], hull[hull.Count - 2][1],
                       hull[hull.Count - 1][0], hull[hull.Count - 1][1],
                       line[0], line[1]))
                hull.RemoveAt(hull.Count - 1);
            hull.Add(line);
        }

        var results = new long[queries.Length];
        for (int i = 0; i < queries.Length; i++)
        {
            long x = queries[i];
            int lo = 0, hi = hull.Count - 1;
            while (lo < hi)
            {
                int mid = (lo + hi) / 2;
                if (hull[mid][0] * x + hull[mid][1] <= hull[mid + 1][0] * x + hull[mid + 1][1])
                    hi = mid;
                else
                    lo = mid + 1;
            }
            results[i] = hull[lo][0] * x + hull[lo][1];
        }
        return results;
    }

    public static long[] Solve(int[][] lines, int[] queries)
    {
        long[][] longLines = lines
            .Select(line => line.Select(value => (long)value).ToArray())
            .ToArray();
        long[] longQueries = queries.Select(value => (long)value).ToArray();
        return Solve(longLines, longQueries);
    }

    public static void Main(string[] args)
    {
        var tokens = Console.ReadLine().Trim().Split();
        int idx = 0;
        int n = int.Parse(tokens[idx++]);
        var lines = new long[n][];
        for (int i = 0; i < n; i++)
            lines[i] = new long[] { long.Parse(tokens[idx++]), long.Parse(tokens[idx++]) };
        int q = int.Parse(tokens[idx++]);
        var queries = new long[q];
        for (int i = 0; i < q; i++) queries[i] = long.Parse(tokens[idx++]);
        Console.WriteLine(string.Join(" ", Solve(lines, queries)));
    }
}
