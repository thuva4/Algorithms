using System;

public class KdTree
{
    public static int KdTreeSearch(int[] data)
    {
        int n = data[0];
        int qx = data[1 + 2 * n], qy = data[2 + 2 * n];
        int best = int.MaxValue;
        int idx = 1;
        for (int i = 0; i < n; i++)
        {
            int dx = data[idx] - qx, dy = data[idx + 1] - qy;
            int d = dx * dx + dy * dy;
            if (d < best) best = d;
            idx += 2;
        }
        return best;
    }

    public static void Main(string[] args)
    {
        Console.WriteLine(KdTreeSearch(new int[] { 3, 1, 2, 3, 4, 5, 6, 3, 3 }));
        Console.WriteLine(KdTreeSearch(new int[] { 2, 0, 0, 5, 5, 0, 0 }));
        Console.WriteLine(KdTreeSearch(new int[] { 1, 3, 4, 0, 0 }));
    }
}
