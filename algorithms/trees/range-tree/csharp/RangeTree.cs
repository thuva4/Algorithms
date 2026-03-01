using System;
using System.Linq;

public class RangeTree
{
    public static int RangeTreeQuery(int[] data)
    {
        int n = data[0];
        int[] points = new int[n];
        Array.Copy(data, 1, points, 0, n);
        Array.Sort(points);
        int lo = data[1 + n], hi = data[2 + n];
        return points.Count(p => p >= lo && p <= hi);
    }

    public static void Main(string[] args)
    {
        Console.WriteLine(RangeTreeQuery(new int[] { 5, 1, 3, 5, 7, 9, 2, 6 }));
        Console.WriteLine(RangeTreeQuery(new int[] { 4, 2, 4, 6, 8, 1, 10 }));
        Console.WriteLine(RangeTreeQuery(new int[] { 3, 1, 2, 3, 10, 20 }));
    }
}
