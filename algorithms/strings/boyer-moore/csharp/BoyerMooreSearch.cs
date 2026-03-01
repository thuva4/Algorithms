using System;
using System.Collections.Generic;

public class BoyerMooreSearch
{
    public static int Solve(int[] arr)
    {
        int textLen = arr[0];
        int patLen = arr[1 + textLen];

        if (patLen == 0) return 0;
        if (patLen > textLen) return -1;

        int[] text = new int[textLen];
        int[] pattern = new int[patLen];
        Array.Copy(arr, 1, text, 0, textLen);
        Array.Copy(arr, 2 + textLen, pattern, 0, patLen);

        var badChar = new Dictionary<int, int>();
        for (int i = 0; i < patLen; i++)
            badChar[pattern[i]] = i;

        int s = 0;
        while (s <= textLen - patLen)
        {
            int j = patLen - 1;
            while (j >= 0 && pattern[j] == text[s + j]) j--;
            if (j < 0) return s;
            int bc = badChar.ContainsKey(text[s + j]) ? badChar[text[s + j]] : -1;
            int shift = j - bc;
            if (shift < 1) shift = 1;
            s += shift;
        }

        return -1;
    }
}
