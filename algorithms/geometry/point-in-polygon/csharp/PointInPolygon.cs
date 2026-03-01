using System;

public class PointInPolygon
{
    public static int CheckPointInPolygon(int[] arr)
    {
        double px = arr[0], py = arr[1];
        int n = arr[2];

        bool inside = false;
        int j = n - 1;
        for (int i = 0; i < n; i++)
        {
            double xi = arr[3 + 2 * i], yi = arr[3 + 2 * i + 1];
            double xj = arr[3 + 2 * j], yj = arr[3 + 2 * j + 1];

            if ((yi > py) != (yj > py) &&
                px < (xj - xi) * (py - yi) / (yj - yi) + xi)
            {
                inside = !inside;
            }
            j = i;
        }

        return inside ? 1 : 0;
    }
}
