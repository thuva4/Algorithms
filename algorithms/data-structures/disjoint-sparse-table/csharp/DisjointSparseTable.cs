using System;
using System.Collections.Generic;

public class DisjointSparseTable
{
    private long[,] table;
    private long[] a;
    private int sz, levels;

    public DisjointSparseTable(int[] arr)
    {
        int n = arr.Length;
        sz = 1; levels = 0;
        while (sz < n) { sz <<= 1; levels++; }
        if (levels == 0) levels = 1;
        a = new long[sz];
        for (int i = 0; i < n; i++) a[i] = arr[i];
        table = new long[levels, sz];
        Build();
    }

    private void Build()
    {
        for (int level = 0; level < levels; level++)
        {
            int block = 1 << (level + 1);
            int half = block >> 1;
            for (int start = 0; start < sz; start += block)
            {
                int mid = start + half;
                table[level, mid] = a[mid];
                int end = Math.Min(start + block, sz);
                for (int i = mid + 1; i < end; i++)
                    table[level, i] = table[level, i - 1] + a[i];
                if (mid - 1 >= start)
                {
                    table[level, mid - 1] = a[mid - 1];
                    for (int i = mid - 2; i >= start; i--)
                        table[level, i] = table[level, i + 1] + a[i];
                }
            }
        }
    }

    public long Query(int l, int r)
    {
        if (l == r) return a[l];
        int level = 31 - LeadingZeros(l ^ r);
        return table[level, l] + table[level, r];
    }

    private static int LeadingZeros(int x)
    {
        if (x == 0) return 32;
        int n = 0;
        if ((x & 0xFFFF0000) == 0) { n += 16; x <<= 16; }
        if ((x & 0xFF000000) == 0) { n += 8; x <<= 8; }
        if ((x & 0xF0000000) == 0) { n += 4; x <<= 4; }
        if ((x & 0xC0000000) == 0) { n += 2; x <<= 2; }
        if ((x & 0x80000000) == 0) { n += 1; }
        return n;
    }

    public static void Main(string[] args)
    {
        var tokens = Console.ReadLine().Trim().Split();
        int idx = 0;
        int n = int.Parse(tokens[idx++]);
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = int.Parse(tokens[idx++]);
        var dst = new DisjointSparseTable(arr);
        int q = int.Parse(tokens[idx++]);
        var results = new List<string>();
        for (int i = 0; i < q; i++)
        {
            int l = int.Parse(tokens[idx++]);
            int r = int.Parse(tokens[idx++]);
            results.Add(dst.Query(l, r).ToString());
        }
        Console.WriteLine(string.Join(" ", results));
    }
}
