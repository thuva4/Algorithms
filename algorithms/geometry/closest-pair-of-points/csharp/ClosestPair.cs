using System;
using System.Collections.Generic;
using System.Linq;

public class ClosestPair
{
    public static int FindClosestPair(int[] arr)
    {
        int n = arr.Length / 2;
        var points = new (int x, int y)[n];
        for (int i = 0; i < n; i++)
            points[i] = (arr[2 * i], arr[2 * i + 1]);

        Array.Sort(points, (a, b) => a.x != b.x ? a.x.CompareTo(b.x) : a.y.CompareTo(b.y));
        return Solve(points, 0, n - 1);
    }

    private static int DistSq((int x, int y) a, (int x, int y) b)
    {
        return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
    }

    private static int Solve((int x, int y)[] pts, int l, int r)
    {
        if (r - l < 3)
        {
            int mn = int.MaxValue;
            for (int i = l; i <= r; i++)
                for (int j = i + 1; j <= r; j++)
                    mn = Math.Min(mn, DistSq(pts[i], pts[j]));
            return mn;
        }

        int mid = (l + r) / 2;
        int midX = pts[mid].x;

        int dl = Solve(pts, l, mid);
        int dr = Solve(pts, mid + 1, r);
        int d = Math.Min(dl, dr);

        var strip = new List<(int x, int y)>();
        for (int i = l; i <= r; i++)
        {
            if ((pts[i].x - midX) * (pts[i].x - midX) < d)
                strip.Add(pts[i]);
        }
        strip.Sort((a, b) => a.y.CompareTo(b.y));

        for (int i = 0; i < strip.Count; i++)
        {
            for (int j = i + 1; j < strip.Count &&
                    (strip[j].y - strip[i].y) * (strip[j].y - strip[i].y) < d; j++)
            {
                d = Math.Min(d, DistSq(strip[i], strip[j]));
            }
        }

        return d;
    }
}
