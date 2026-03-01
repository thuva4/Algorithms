using System;

public class RobinKarpRollingHash
{
    public static int Solve(int[] arr)
    {
        int idx = 0;
        int tlen = arr[idx++];
        int[] text = new int[tlen];
        for (int i = 0; i < tlen; i++) text[i] = arr[idx++];
        int plen = arr[idx++];
        int[] pattern = new int[plen];
        for (int i = 0; i < plen; i++) pattern[i] = arr[idx++];
        if (plen > tlen) return -1;

        for (int i = 0; i <= tlen - plen; i++)
        {
            bool match = true;
            for (int j = 0; j < plen; j++)
                if (text[i + j] != pattern[j]) { match = false; break; }
            if (match) return i;
        }
        return -1;
    }

    static void Main(string[] args)
    {
        Console.WriteLine(Solve(new int[] { 5, 1, 2, 3, 4, 5, 2, 1, 2 }));
        Console.WriteLine(Solve(new int[] { 5, 1, 2, 3, 4, 5, 2, 3, 4 }));
        Console.WriteLine(Solve(new int[] { 4, 1, 2, 3, 4, 2, 5, 6 }));
        Console.WriteLine(Solve(new int[] { 4, 1, 2, 3, 4, 1, 4 }));
    }
}
