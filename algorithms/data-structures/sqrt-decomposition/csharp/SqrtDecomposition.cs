using System;
using System.Collections.Generic;

public class SqrtDecomposition
{
    private int[] a;
    private long[] blocks;
    private int blockSz;

    public SqrtDecomposition(int[] arr)
    {
        int n = arr.Length;
        a = (int[])arr.Clone();
        blockSz = Math.Max(1, (int)Math.Sqrt(n));
        blocks = new long[(n + blockSz - 1) / blockSz];
        for (int i = 0; i < n; i++) blocks[i / blockSz] += arr[i];
    }

    public long Query(int l, int r)
    {
        long result = 0;
        int bl = l / blockSz, br = r / blockSz;
        if (bl == br)
        {
            for (int i = l; i <= r; i++) result += a[i];
        }
        else
        {
            for (int i = l; i < (bl + 1) * blockSz; i++) result += a[i];
            for (int b = bl + 1; b < br; b++) result += blocks[b];
            for (int i = br * blockSz; i <= r; i++) result += a[i];
        }
        return result;
    }

    public static void Main(string[] args)
    {
        var tokens = Console.ReadLine().Trim().Split();
        int idx = 0;
        int n = int.Parse(tokens[idx++]);
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = int.Parse(tokens[idx++]);
        var sd = new SqrtDecomposition(arr);
        int q = int.Parse(tokens[idx++]);
        var results = new List<string>();
        for (int i = 0; i < q; i++)
        {
            int l = int.Parse(tokens[idx++]);
            int r = int.Parse(tokens[idx++]);
            results.Add(sd.Query(l, r).ToString());
        }
        Console.WriteLine(string.Join(" ", results));
    }
}
