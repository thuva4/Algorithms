using System;
using System.Linq;

public class SuffixArray
{
    public static int[] Run(int[] arr)
    {
        int n = arr.Length;
        if (n == 0) return new int[0];
        int[] sa = Enumerable.Range(0, n).ToArray();
        int[] rank = (int[])arr.Clone();
        int[] tmp = new int[n];
        for (int k = 1; k < n; k *= 2)
        {
            int[] r = (int[])rank.Clone();
            int step = k;
            Array.Sort(sa, (a, b) =>
            {
                if (r[a] != r[b]) return r[a].CompareTo(r[b]);
                int ra = a + step < n ? r[a + step] : -1;
                int rb = b + step < n ? r[b + step] : -1;
                return ra.CompareTo(rb);
            });
            tmp[sa[0]] = 0;
            for (int i = 1; i < n; i++)
            {
                tmp[sa[i]] = tmp[sa[i - 1]];
                int p0 = r[sa[i - 1]], c0 = r[sa[i]];
                int p1 = sa[i - 1] + step < n ? r[sa[i - 1] + step] : -1;
                int c1 = sa[i] + step < n ? r[sa[i] + step] : -1;
                if (p0 != c0 || p1 != c1) tmp[sa[i]]++;
            }
            Array.Copy(tmp, rank, n);
            if (rank[sa[n - 1]] == n - 1) break;
        }
        return sa;
    }
}
