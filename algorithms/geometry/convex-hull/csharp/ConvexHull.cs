using System;
using System.Collections.Generic;

public class ConvexHull
{
    public static int ConvexHullCount(int[] arr)
    {
        int n = arr[0];
        if (n <= 2) return n;

        var points = new (int x, int y)[n];
        int idx = 1;
        for (int i = 0; i < n; i++) { points[i] = (arr[idx], arr[idx + 1]); idx += 2; }
        Array.Sort(points, (a, b) => a.x != b.x ? a.x.CompareTo(b.x) : a.y.CompareTo(b.y));

        long Cross((int x, int y) o, (int x, int y) a, (int x, int y) b) =>
            (long)(a.x - o.x) * (b.y - o.y) - (long)(a.y - o.y) * (b.x - o.x);

        var hull = new List<(int x, int y)>();
        foreach (var p in points)
        {
            while (hull.Count >= 2 && Cross(hull[hull.Count - 2], hull[hull.Count - 1], p) <= 0) hull.RemoveAt(hull.Count - 1);
            hull.Add(p);
        }
        int lower = hull.Count + 1;
        for (int i = n - 2; i >= 0; i--)
        {
            while (hull.Count >= lower && Cross(hull[hull.Count - 2], hull[hull.Count - 1], points[i]) <= 0) hull.RemoveAt(hull.Count - 1);
            hull.Add(points[i]);
        }
        return hull.Count - 1;
    }
}
