using System;

public class CountSetBits
{
    public static int Solve(int[] arr)
    {
        int total = 0;
        foreach (int num in arr)
        {
            int n = num;
            while (n != 0)
            {
                total++;
                n &= (n - 1);
            }
        }
        return total;
    }
}
