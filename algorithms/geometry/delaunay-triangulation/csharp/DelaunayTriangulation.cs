using System;
using System.Collections.Generic;

public class DelaunayTriangulation
{
    private struct Point
    {
        public int X;
        public int Y;

        public Point(int x, int y)
        {
            X = x;
            Y = y;
        }
    }

    private static long Cross(Point o, Point a, Point b)
    {
        return (long)(a.X - o.X) * (b.Y - o.Y) - (long)(a.Y - o.Y) * (b.X - o.X);
    }

    private static int ConvexHullVertexCount(Point[] points)
    {
        if (points.Length <= 1) return points.Length;

        Array.Sort(points, (a, b) =>
        {
            int cmp = a.X.CompareTo(b.X);
            return cmp != 0 ? cmp : a.Y.CompareTo(b.Y);
        });

        var hull = new List<Point>();

        foreach (Point p in points)
        {
            while (hull.Count >= 2 && Cross(hull[hull.Count - 2], hull[hull.Count - 1], p) <= 0)
            {
                hull.RemoveAt(hull.Count - 1);
            }
            hull.Add(p);
        }

        int lowerCount = hull.Count;
        for (int i = points.Length - 2; i >= 0; i--)
        {
            Point p = points[i];
            while (hull.Count > lowerCount && Cross(hull[hull.Count - 2], hull[hull.Count - 1], p) <= 0)
            {
                hull.RemoveAt(hull.Count - 1);
            }
            hull.Add(p);
        }

        return Math.Max(0, hull.Count - 1);
    }

    public static int Compute(int[] arr)
    {
        int n = arr[0];
        if (n < 3) return 0;

        Point[] points = new Point[n];
        for (int i = 0; i < n; i++)
        {
            points[i] = new Point(arr[1 + 2 * i], arr[1 + 2 * i + 1]);
        }

        int hullVertices = ConvexHullVertexCount(points);
        return (2 * n) - 2 - hullVertices;
    }
}
