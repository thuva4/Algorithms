using System;

public class WildcardMatching
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

        bool[,] dp = new bool[tlen + 1, plen + 1];
        dp[0, 0] = true;
        for (int j = 1; j <= plen; j++)
            if (pattern[j-1] == 0) dp[0, j] = dp[0, j-1];

        for (int i = 1; i <= tlen; i++)
            for (int j = 1; j <= plen; j++) {
                if (pattern[j-1] == 0) dp[i, j] = dp[i-1, j] || dp[i, j-1];
                else if (pattern[j-1] == -1 || pattern[j-1] == text[i-1]) dp[i, j] = dp[i-1, j-1];
            }

        return dp[tlen, plen] ? 1 : 0;
    }

    static void Main(string[] args)
    {
        Console.WriteLine(Solve(new int[] { 3, 1, 2, 3, 3, 1, 2, 3 }));
        Console.WriteLine(Solve(new int[] { 3, 1, 2, 3, 1, 0 }));
        Console.WriteLine(Solve(new int[] { 3, 1, 2, 3, 3, 1, -1, 3 }));
        Console.WriteLine(Solve(new int[] { 2, 1, 2, 2, 3, 4 }));
        Console.WriteLine(Solve(new int[] { 0, 1, 0 }));
    }
}
