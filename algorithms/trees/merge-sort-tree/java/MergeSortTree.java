import java.util.*;

public class MergeSortTree {
    int[][] tree;
    int n;

    public MergeSortTree(int[] arr) {
        n = arr.length;
        tree = new int[4 * n][];
        build(arr, 1, 0, n - 1);
    }

    void build(int[] a, int nd, int s, int e) {
        if (s == e) { tree[nd] = new int[]{a[s]}; return; }
        int m = (s + e) / 2;
        build(a, 2*nd, s, m); build(a, 2*nd+1, m+1, e);
        tree[nd] = merge(tree[2*nd], tree[2*nd+1]);
    }

    int[] merge(int[] a, int[] b) {
        int[] r = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;
        while (i < a.length && j < b.length) r[k++] = a[i] <= b[j] ? a[i++] : b[j++];
        while (i < a.length) r[k++] = a[i++];
        while (j < b.length) r[k++] = b[j++];
        return r;
    }

    int upperBound(int[] arr, int k) {
        int lo = 0, hi = arr.length;
        while (lo < hi) { int m = (lo + hi) / 2; if (arr[m] <= k) lo = m + 1; else hi = m; }
        return lo;
    }

    public int countLeq(int l, int r, int k) { return query(1, 0, n - 1, l, r, k); }

    public static int[] mergeSortTree(int n, int[] array, int[][] queries) {
        MergeSortTree mst = new MergeSortTree(array);
        int[] result = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            result[i] = mst.countLeq(queries[i][0], queries[i][1], queries[i][2]);
        }
        return result;
    }

    int query(int nd, int s, int e, int l, int r, int k) {
        if (r < s || e < l) return 0;
        if (l <= s && e <= r) return upperBound(tree[nd], k);
        int m = (s + e) / 2;
        return query(2*nd, s, m, l, r, k) + query(2*nd+1, m+1, e, l, r, k);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        MergeSortTree mst = new MergeSortTree(arr);
        int q = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int l = sc.nextInt(), r = sc.nextInt(), k = sc.nextInt();
            if (i > 0) sb.append(' ');
            sb.append(mst.countLeq(l, r, k));
        }
        System.out.println(sb);
    }
}
