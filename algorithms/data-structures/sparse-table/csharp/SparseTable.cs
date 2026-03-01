using System;
using System.Collections.Generic;

public class SparseTable
{
    private int[,] table;
    private int[] lg;

    public SparseTable(int[] arr)
    {
        int n = arr.Length;
        int k = 1;
        while ((1 << k) <= n) k++;
        table = new int[k, n];
        lg = new int[n + 1];
        for (int i = 2; i <= n; i++) lg[i] = lg[i / 2] + 1;
        for (int i = 0; i < n; i++) table[0, i] = arr[i];
        for (int j = 1; j < k; j++)
            for (int i = 0; i + (1 << j) <= n; i++)
                table[j, i] = Math.Min(table[j - 1, i], table[j - 1, i + (1 << (j - 1))]);
    }

    public int Query(int l, int r)
    {
        int k = lg[r - l + 1];
        return Math.Min(table[k, l], table[k, r - (1 << k) + 1]);
    }

    public static void Main(string[] args)
    {
        var tokens = Console.ReadLine().Trim().Split();
        int idx = 0;
        int n = int.Parse(tokens[idx++]);
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = int.Parse(tokens[idx++]);
        var st = new SparseTable(arr);
        int q = int.Parse(tokens[idx++]);
        var results = new List<string>();
        for (int i = 0; i < q; i++)
        {
            int l = int.Parse(tokens[idx++]);
            int r = int.Parse(tokens[idx++]);
            results.Add(st.Query(l, r).ToString());
        }
        Console.WriteLine(string.Join(" ", results));
    }
}
