using System;
using System.Collections.Generic;

public class PersistentSegmentTree
{
    static List<long> vals = new List<long>();
    static List<int> lefts = new List<int>();
    static List<int> rights = new List<int>();

    static int NewNode(long v, int l = 0, int r = 0)
    {
        int id = vals.Count; vals.Add(v); lefts.Add(l); rights.Add(r); return id;
    }

    static int Build(int[] a, int s, int e)
    {
        if (s == e) return NewNode(a[s]);
        int m = (s + e) / 2;
        int l = Build(a, s, m), r = Build(a, m + 1, e);
        return NewNode(vals[l] + vals[r], l, r);
    }

    static int Update(int nd, int s, int e, int idx, int val)
    {
        if (s == e) return NewNode(val);
        int m = (s + e) / 2;
        if (idx <= m)
        {
            int nl = Update(lefts[nd], s, m, idx, val);
            return NewNode(vals[nl] + vals[rights[nd]], nl, rights[nd]);
        }
        int nr = Update(rights[nd], m + 1, e, idx, val);
        return NewNode(vals[lefts[nd]] + vals[nr], lefts[nd], nr);
    }

    static long Query(int nd, int s, int e, int l, int r)
    {
        if (r < s || e < l) return 0;
        if (l <= s && e <= r) return vals[nd];
        int m = (s + e) / 2;
        return Query(lefts[nd], s, m, l, r) + Query(rights[nd], m + 1, e, l, r);
    }

    public static void Main(string[] args)
    {
        var tokens = Console.ReadLine().Trim().Split();
        int idx = 0;
        int n = int.Parse(tokens[idx++]);
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = int.Parse(tokens[idx++]);
        var roots = new List<int> { Build(arr, 0, n - 1) };
        int q = int.Parse(tokens[idx++]);
        var results = new List<string>();
        for (int i = 0; i < q; i++)
        {
            int t = int.Parse(tokens[idx++]), a1 = int.Parse(tokens[idx++]);
            int b1 = int.Parse(tokens[idx++]), c1 = int.Parse(tokens[idx++]);
            if (t == 1) roots.Add(Update(roots[a1], 0, n - 1, b1, c1));
            else results.Add(Query(roots[a1], 0, n - 1, b1, c1).ToString());
        }
        Console.WriteLine(string.Join(" ", results));
    }
}
