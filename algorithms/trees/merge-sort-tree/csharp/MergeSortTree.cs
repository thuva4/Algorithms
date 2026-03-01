using System;
using System.Collections.Generic;

public class MergeSortTree
{
    int[][] tree;
    int n;

    public MergeSortTree(int[] arr)
    {
        n = arr.Length;
        tree = new int[4 * n][];
        Build(arr, 1, 0, n - 1);
    }

    void Build(int[] a, int nd, int s, int e)
    {
        if (s == e) { tree[nd] = new int[] { a[s] }; return; }
        int m = (s + e) / 2;
        Build(a, 2 * nd, s, m); Build(a, 2 * nd + 1, m + 1, e);
        tree[nd] = MergeSorted(tree[2 * nd], tree[2 * nd + 1]);
    }

    int[] MergeSorted(int[] a, int[] b)
    {
        int[] r = new int[a.Length + b.Length];
        int i = 0, j = 0, k = 0;
        while (i < a.Length && j < b.Length) r[k++] = a[i] <= b[j] ? a[i++] : b[j++];
        while (i < a.Length) r[k++] = a[i++];
        while (j < b.Length) r[k++] = b[j++];
        return r;
    }

    int UpperBound(int[] arr, int k)
    {
        int lo = 0, hi = arr.Length;
        while (lo < hi) { int m = (lo + hi) / 2; if (arr[m] <= k) lo = m + 1; else hi = m; }
        return lo;
    }

    public int CountLeq(int l, int r, int k) => Query(1, 0, n - 1, l, r, k);

    int Query(int nd, int s, int e, int l, int r, int k)
    {
        if (r < s || e < l) return 0;
        if (l <= s && e <= r) return UpperBound(tree[nd], k);
        int m = (s + e) / 2;
        return Query(2 * nd, s, m, l, r, k) + Query(2 * nd + 1, m + 1, e, l, r, k);
    }

    public static void Main(string[] args)
    {
        var tokens = Console.ReadLine().Trim().Split();
        int idx = 0;
        int n = int.Parse(tokens[idx++]);
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = int.Parse(tokens[idx++]);
        var mst = new MergeSortTree(arr);
        int q = int.Parse(tokens[idx++]);
        var results = new List<string>();
        for (int i = 0; i < q; i++)
        {
            int l = int.Parse(tokens[idx++]), r = int.Parse(tokens[idx++]), k = int.Parse(tokens[idx++]);
            results.Add(mst.CountLeq(l, r, k).ToString());
        }
        Console.WriteLine(string.Join(" ", results));
    }
}
