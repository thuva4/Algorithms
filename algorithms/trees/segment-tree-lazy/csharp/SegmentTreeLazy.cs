using System;
using System.Collections.Generic;

public class SegmentTreeLazy
{
    long[] tree, lazy;
    int n;

    public SegmentTreeLazy(int[] arr)
    {
        n = arr.Length;
        tree = new long[4 * n]; lazy = new long[4 * n];
        Build(arr, 1, 0, n - 1);
    }

    void Build(int[] a, int nd, int s, int e)
    {
        if (s == e) { tree[nd] = a[s]; return; }
        int m = (s + e) / 2;
        Build(a, 2*nd, s, m); Build(a, 2*nd+1, m+1, e);
        tree[nd] = tree[2*nd] + tree[2*nd+1];
    }

    void ApplyNode(int nd, int s, int e, long v) { tree[nd] += v * (e - s + 1); lazy[nd] += v; }

    void PushDown(int nd, int s, int e)
    {
        if (lazy[nd] != 0)
        {
            int m = (s + e) / 2;
            ApplyNode(2*nd, s, m, lazy[nd]); ApplyNode(2*nd+1, m+1, e, lazy[nd]);
            lazy[nd] = 0;
        }
    }

    public void Update(int l, int r, long v) => DoUpdate(1, 0, n-1, l, r, v);

    void DoUpdate(int nd, int s, int e, int l, int r, long v)
    {
        if (r < s || e < l) return;
        if (l <= s && e <= r) { ApplyNode(nd, s, e, v); return; }
        PushDown(nd, s, e);
        int m = (s + e) / 2;
        DoUpdate(2*nd, s, m, l, r, v); DoUpdate(2*nd+1, m+1, e, l, r, v);
        tree[nd] = tree[2*nd] + tree[2*nd+1];
    }

    public long Query(int l, int r) => DoQuery(1, 0, n-1, l, r);

    long DoQuery(int nd, int s, int e, int l, int r)
    {
        if (r < s || e < l) return 0;
        if (l <= s && e <= r) return tree[nd];
        PushDown(nd, s, e);
        int m = (s + e) / 2;
        return DoQuery(2*nd, s, m, l, r) + DoQuery(2*nd+1, m+1, e, l, r);
    }

    public static void Main(string[] args)
    {
        var tokens = Console.ReadLine().Trim().Split();
        int idx = 0;
        int n = int.Parse(tokens[idx++]);
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = int.Parse(tokens[idx++]);
        var st = new SegmentTreeLazy(arr);
        int q = int.Parse(tokens[idx++]);
        var results = new List<string>();
        for (int i = 0; i < q; i++)
        {
            int t = int.Parse(tokens[idx++]), l = int.Parse(tokens[idx++]);
            int r = int.Parse(tokens[idx++]), v = int.Parse(tokens[idx++]);
            if (t == 1) st.Update(l, r, v);
            else results.Add(st.Query(l, r).ToString());
        }
        Console.WriteLine(string.Join(" ", results));
    }
}
