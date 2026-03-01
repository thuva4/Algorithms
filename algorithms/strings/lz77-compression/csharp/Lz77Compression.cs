using System;

public class Lz77Compression
{
    public static int Solve(int[] arr)
    {
        int n = arr.Length, count = 0, i = 0;
        while (i < n) {
            int bestLen = 0, start = Math.Max(0, i - 256);
            for (int j = start; j < i; j++) {
                int len = 0, dist = i - j;
                while (i+len < n && len < dist && arr[j+len] == arr[i+len]) len++;
                if (len == dist) while (i+len < n && arr[j+(len%dist)] == arr[i+len]) len++;
                if (len > bestLen) bestLen = len;
            }
            if (bestLen >= 2) { count++; i += bestLen; } else i++;
        }
        return count;
    }

    static void Main(string[] args)
    {
        Console.WriteLine(Solve(new int[] { 1,2,3,1,2,3 }));
        Console.WriteLine(Solve(new int[] { 5,5,5,5 }));
        Console.WriteLine(Solve(new int[] { 1,2,3,4 }));
        Console.WriteLine(Solve(new int[] { 1,2,1,2,3,4,3,4 }));
    }
}
