import java.util.*;

public class BoyerMooreSearch {

    public static int boyerMooreSearch(int[] arr) {
        int textLen = arr[0];
        int patLen = arr[1 + textLen];

        if (patLen == 0) return 0;
        if (patLen > textLen) return -1;

        int[] text = new int[textLen];
        int[] pattern = new int[patLen];
        System.arraycopy(arr, 1, text, 0, textLen);
        System.arraycopy(arr, 2 + textLen, pattern, 0, patLen);

        Map<Integer, Integer> badChar = new HashMap<>();
        for (int i = 0; i < patLen; i++) {
            badChar.put(pattern[i], i);
        }

        int s = 0;
        while (s <= textLen - patLen) {
            int j = patLen - 1;
            while (j >= 0 && pattern[j] == text[s + j]) j--;
            if (j < 0) return s;
            int bc = badChar.getOrDefault(text[s + j], -1);
            int shift = j - bc;
            if (shift < 1) shift = 1;
            s += shift;
        }

        return -1;
    }
}
