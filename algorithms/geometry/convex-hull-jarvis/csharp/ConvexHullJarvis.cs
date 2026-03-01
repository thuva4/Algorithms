using System;
using System.Collections.Generic;

public class ConvexHullJarvis
{
    public static int Compute(int[] arr)
    {
        int n = arr[0];
        if (n < 2) return n;

        int[] px = new int[n], py = new int[n];
        for (int i = 0; i < n; i++)
        {
            px[i] = arr[1 + 2 * i];
            py[i] = arr[1 + 2 * i + 1];
        }

        int start = 0;
        for (int i = 1; i < n; i++)
        {
            if (px[i] < px[start] || (px[i] == px[start] && py[i] < py[start]))
                start = i;
        }

        int hullCount = 0;
        int current = start;
        do
        {
            hullCount++;
            int candidate = 0;
            for (int i = 1; i < n; i++)
            {
                if (i == current) continue;
                if (candidate == current) { candidate = i; continue; }
                int c = Cross(px, py, current, candidate, i);
                if (c < 0) candidate = i;
                else if (c == 0 && DistSq(px, py, current, i) > DistSq(px, py, current, candidate))
                    candidate = i;
            }
            current = candidate;
        } while (current != start);

        return hullCount;
    }

    private static int Cross(int[] px, int[] py, int o, int a, int b)
    {
        return (px[a] - px[o]) * (py[b] - py[o]) - (py[a] - py[o]) * (px[b] - px[o]);
    }

    private static int DistSq(int[] px, int[] py, int a, int b)
    {
        return (px[a] - px[b]) * (px[a] - px[b]) + (py[a] - py[b]) * (py[a] - py[b]);
    }
}
