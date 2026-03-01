using System;

class RabinKarp
{
    const int Prime = 101;
    const int Base = 256;

    static int RabinKarpSearch(string text, string pattern)
    {
        int n = text.Length;
        int m = pattern.Length;

        if (m == 0) return 0;
        if (m > n) return -1;

        long patHash = 0, txtHash = 0, h = 1;

        for (int i = 0; i < m - 1; i++)
            h = (h * Base) % Prime;

        for (int i = 0; i < m; i++)
        {
            patHash = (Base * patHash + pattern[i]) % Prime;
            txtHash = (Base * txtHash + text[i]) % Prime;
        }

        for (int i = 0; i <= n - m; i++)
        {
            if (patHash == txtHash)
            {
                bool match = true;
                for (int j = 0; j < m; j++)
                {
                    if (text[i + j] != pattern[j])
                    {
                        match = false;
                        break;
                    }
                }
                if (match) return i;
            }
            if (i < n - m)
            {
                txtHash = (Base * (txtHash - text[i] * h) + text[i + m]) % Prime;
                if (txtHash < 0) txtHash += Prime;
            }
        }
        return -1;
    }

    static void Main(string[] args)
    {
        string text = "ABABDABACDABABCABAB";
        string pattern = "ABABCABAB";
        Console.WriteLine("Pattern found at index: " + RabinKarpSearch(text, pattern));
    }
}
