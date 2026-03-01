import java.util.Scanner;

public class DisjointSparseTable {
    private long[][] table;
    private long[] a;
    private int sz, levels;

    public DisjointSparseTable(int[] arr) {
        int n = arr.length;
        sz = 1; levels = 0;
        while (sz < n) { sz <<= 1; levels++; }
        if (levels == 0) levels = 1;
        a = new long[sz];
        for (int i = 0; i < n; i++) a[i] = arr[i];
        table = new long[levels][sz];
        build();
    }

    private void build() {
        for (int level = 0; level < levels; level++) {
            int block = 1 << (level + 1);
            int half = block >> 1;
            for (int start = 0; start < sz; start += block) {
                int mid = start + half;
                table[level][mid] = a[mid];
                for (int i = mid + 1; i < Math.min(start + block, sz); i++)
                    table[level][i] = table[level][i - 1] + a[i];
                if (mid - 1 >= start) {
                    table[level][mid - 1] = a[mid - 1];
                    for (int i = mid - 2; i >= start; i--)
                        table[level][i] = table[level][i + 1] + a[i];
                }
            }
        }
    }

    public long query(int l, int r) {
        if (l == r) return a[l];
        int level = 31 - Integer.numberOfLeadingZeros(l ^ r);
        return table[level][l] + table[level][r];
    }

    public static long[] disjointSparseTable(int n, int[] array, int[][] queries) {
        long[] result = new long[queries.length];
        if (array.length == 0) {
            return result;
        }
        if (array.length == 1) {
            java.util.Arrays.fill(result, array[0]);
            return result;
        }
        DisjointSparseTable dst = new DisjointSparseTable(array);
        for (int i = 0; i < queries.length; i++) {
            result[i] = dst.query(queries[i][0], queries[i][1]);
        }
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        DisjointSparseTable dst = new DisjointSparseTable(arr);
        int q = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int l = sc.nextInt(), r = sc.nextInt();
            if (i > 0) sb.append(' ');
            sb.append(dst.query(l, r));
        }
        System.out.println(sb);
    }
}
