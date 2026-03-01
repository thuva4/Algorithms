using System;
using System.Collections.Generic;
using System.Linq;

public class MoAlgorithm
{
    public static long[] Solve(int n, int[] arr, int[][] queries)
    {
        int q = queries.Length;
        int block = Math.Max(1, (int)Math.Sqrt(n));
        int[] order = Enumerable.Range(0, q).ToArray();
        Array.Sort(order, (a, b) =>
        {
            int ba = queries[a][0] / block, bb = queries[b][0] / block;
            if (ba != bb) return ba.CompareTo(bb);
            return ba % 2 == 0 ? queries[a][1].CompareTo(queries[b][1]) : queries[b][1].CompareTo(queries[a][1]);
        });

        long[] results = new long[q];
        int curL = 0, curR = -1;
        long curSum = 0;
        foreach (int idx in order)
        {
            int l = queries[idx][0], r = queries[idx][1];
            while (curR < r) curSum += arr[++curR];
            while (curL > l) curSum += arr[--curL];
            while (curR > r) curSum -= arr[curR--];
            while (curL < l) curSum -= arr[curL++];
            results[idx] = curSum;
        }
        return results;
    }

    public static void Main(string[] args)
    {
        var tokens = Console.ReadLine().Trim().Split();
        int idx = 0;
        int n = int.Parse(tokens[idx++]);
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = int.Parse(tokens[idx++]);
        int q = int.Parse(tokens[idx++]);
        int[][] queries = new int[q][];
        for (int i = 0; i < q; i++)
            queries[i] = new int[] { int.Parse(tokens[idx++]), int.Parse(tokens[idx++]) };
        Console.WriteLine(string.Join(" ", Solve(n, arr, queries)));
    }
}
