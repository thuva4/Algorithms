import java.util.*;

public class SuffixTree {
    public static int suffixTree(int[] arr) {
        int n = arr.length;
        if (n == 0) return 0;

        // Build suffix array
        Integer[] sa = new Integer[n];
        int[] rank = new int[n], tmp = new int[n];
        for (int i = 0; i < n; i++) { sa[i] = i; rank[i] = arr[i]; }
        for (int k = 1; k < n; k *= 2) {
            final int[] r = rank.clone();
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
                int p0 = r[sa[i-1]], c0 = r[sa[i]];
                int p1 = sa[i-1]+step<n ? r[sa[i-1]+step] : -1;
                int c1 = sa[i]+step<n ? r[sa[i]+step] : -1;
                if (p0 != c0 || p1 != c1) tmp[sa[i]]++;
            }
            System.arraycopy(tmp, 0, rank, 0, n);
            if (rank[sa[n-1]] == n-1) break;
        }

        // Build LCP (Kasai's)
        int[] invSa = new int[n], lcp = new int[n];
        for (int i = 0; i < n; i++) invSa[sa[i]] = i;
        int h = 0;
        for (int i = 0; i < n; i++) {
            if (invSa[i] > 0) {
                int j = sa[invSa[i] - 1];
                while (i+h < n && j+h < n && arr[i+h] == arr[j+h]) h++;
                lcp[invSa[i]] = h;
                if (h > 0) h--;
            } else { h = 0; }
        }

        long total = (long)n * (n + 1) / 2;
        for (int v : lcp) total -= v;
        return (int)total;
    }
}
