using System;

class KMP
{
    static int[] ComputeLPS(string pattern)
    {
        int m = pattern.Length;
        int[] lps = new int[m];
        int len = 0;
        int i = 1;

        while (i < m)
        {
            if (pattern[i] == pattern[len])
            {
                len++;
                lps[i] = len;
                i++;
            }
            else
            {
                if (len != 0)
                    len = lps[len - 1];
                else
                {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        return lps;
    }

    static int KMPSearch(string text, string pattern)
    {
        int n = text.Length;
        int m = pattern.Length;

        if (m == 0) return 0;

        int[] lps = ComputeLPS(pattern);

        int i = 0, j = 0;
        while (i < n)
        {
            if (pattern[j] == text[i])
            {
                i++;
                j++;
            }
            if (j == m)
            {
                return i - j;
            }
            else if (i < n && pattern[j] != text[i])
            {
                if (j != 0)
                    j = lps[j - 1];
                else
                    i++;
            }
        }
        return -1;
    }

    static void Main(string[] args)
    {
        string text = "ABABDABACDABABCABAB";
        string pattern = "ABABCABAB";
        Console.WriteLine("Pattern found at index: " + KMPSearch(text, pattern));
    }
}
