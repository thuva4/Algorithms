import java.util.*;

public class SuffixArray {
    public static int[] suffixArray(int[] arr) {
        int n = arr.length;
        if (n == 0) return new int[0];
        Integer[] sa = new Integer[n];
        int[] rank = new int[n];
        int[] tmp = new int[n];
        for (int i = 0; i < n; i++) {
            sa[i] = i;
            rank[i] = arr[i];
        }
        for (int k = 1; k < n; k *= 2) {
            final int[] r = rank;
            final int step = k;
            Arrays.sort(sa, (a, b) -> {
                if (r[a] != r[b]) return Integer.compare(r[a], r[b]);
                int ra = a + step < n ? r[a + step] : -1;
                int rb = b + step < n ? r[b + step] : -1;
                return Integer.compare(ra, rb);
            });
            tmp[sa[0]] = 0;
            for (int i = 1; i < n; i++) {
                tmp[sa[i]] = tmp[sa[i - 1]];
                int prev0 = r[sa[i - 1]], prev1 = sa[i - 1] + step < n ? r[sa[i - 1] + step] : -1;
                int cur0 = r[sa[i]], cur1 = sa[i] + step < n ? r[sa[i] + step] : -1;
                if (prev0 != cur0 || prev1 != cur1) tmp[sa[i]]++;
            }
            System.arraycopy(tmp, 0, rank, 0, n);
            if (rank[sa[n - 1]] == n - 1) break;
        }
        int[] result = new int[n];
        for (int i = 0; i < n; i++) result[i] = sa[i];
        return result;
    }
}
