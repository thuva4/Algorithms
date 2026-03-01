import java.util.*;

public class ConvexHullTrick {

    static long[] ms, bs;
    static int size;

    static void init(int capacity) {
        ms = new long[capacity];
        bs = new long[capacity];
        size = 0;
    }

    static boolean bad(int l1, int l2, int l3) {
        return (double)(bs[l3] - bs[l1]) * (ms[l1] - ms[l2])
             <= (double)(bs[l2] - bs[l1]) * (ms[l1] - ms[l3]);
    }

    static void addLine(long m, long b) {
        ms[size] = m;
        bs[size] = b;
        while (size >= 2 && bad(size - 2, size - 1, size)) {
            ms[size - 1] = ms[size];
            bs[size - 1] = bs[size];
            size--;
        }
        size++;
    }

    static long query(long x) {
        int lo = 0, hi = size - 1;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (ms[mid] * x + bs[mid] <= ms[mid + 1] * x + bs[mid + 1]) hi = mid;
            else lo = mid + 1;
        }
        return ms[lo] * x + bs[lo];
    }

    public static long[] convexHullTrick(int n, long[][] lines, long[] queries) {
        long[] result = new long[queries.length];
        for (int i = 0; i < queries.length; i++) {
            long best = Long.MAX_VALUE;
            for (long[] line : lines) {
                best = Math.min(best, line[0] * queries[i] + line[1]);
            }
            result[i] = best;
        }
        return result;
    }

    public static long[] solve(long[][] lines, long[] queries) {
        Arrays.sort(lines, (a, b2) -> Long.compare(a[0], b2[0]));
        init(lines.length + 1);
        for (long[] line : lines) addLine(line[0], line[1]);
        long[] result = new long[queries.length];
        for (int i = 0; i < queries.length; i++) result[i] = query(queries[i]);
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[][] lines = new long[n][2];
        for (int i = 0; i < n; i++) { lines[i][0] = sc.nextLong(); lines[i][1] = sc.nextLong(); }
        int q = sc.nextInt();
        long[] queries = new long[q];
        for (int i = 0; i < q; i++) queries[i] = sc.nextLong();
        long[] result = solve(lines, queries);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < result.length; i++) { if (i > 0) sb.append(' '); sb.append(result[i]); }
        System.out.println(sb);
    }
}
