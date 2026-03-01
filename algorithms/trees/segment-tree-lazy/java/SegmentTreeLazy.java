import java.util.*;

public class SegmentTreeLazy {
    long[] tree, lazy;
    int n;

    public SegmentTreeLazy(int[] arr) {
        n = arr.length;
        tree = new long[4 * n];
        lazy = new long[4 * n];
        build(arr, 1, 0, n - 1);
    }

    void build(int[] arr, int node, int s, int e) {
        if (s == e) { tree[node] = arr[s]; return; }
        int mid = (s + e) / 2;
        build(arr, 2 * node, s, mid);
        build(arr, 2 * node + 1, mid + 1, e);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    void pushDown(int node, int s, int e) {
        if (lazy[node] != 0) {
            int mid = (s + e) / 2;
            apply(2 * node, s, mid, lazy[node]);
            apply(2 * node + 1, mid + 1, e, lazy[node]);
            lazy[node] = 0;
        }
    }

    void apply(int node, int s, int e, long val) {
        tree[node] += val * (e - s + 1);
        lazy[node] += val;
    }

    public void update(int l, int r, long val) { update(1, 0, n - 1, l, r, val); }

    void update(int node, int s, int e, int l, int r, long val) {
        if (r < s || e < l) return;
        if (l <= s && e <= r) { apply(node, s, e, val); return; }
        pushDown(node, s, e);
        int mid = (s + e) / 2;
        update(2 * node, s, mid, l, r, val);
        update(2 * node + 1, mid + 1, e, l, r, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    public long query(int l, int r) { return query(1, 0, n - 1, l, r); }

    public static long[] segmentTreeLazy(int n, int[] array, int[][] operations) {
        SegmentTreeLazy st = new SegmentTreeLazy(array);
        java.util.List<Long> answers = new java.util.ArrayList<>();
        for (int[] operation : operations) {
            if (operation[0] == 1) {
                st.update(operation[1], operation[2], operation[3]);
            } else {
                answers.add(st.query(operation[1], operation[2]));
            }
        }
        long[] result = new long[answers.size()];
        for (int i = 0; i < answers.size(); i++) {
            result[i] = answers.get(i);
        }
        return result;
    }

    long query(int node, int s, int e, int l, int r) {
        if (r < s || e < l) return 0;
        if (l <= s && e <= r) return tree[node];
        pushDown(node, s, e);
        int mid = (s + e) / 2;
        return query(2 * node, s, mid, l, r) + query(2 * node + 1, mid + 1, e, l, r);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        SegmentTreeLazy st = new SegmentTreeLazy(arr);
        int q = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        boolean first = true;
        for (int i = 0; i < q; i++) {
            int type = sc.nextInt(), l = sc.nextInt(), r = sc.nextInt(), v = sc.nextInt();
            if (type == 1) st.update(l, r, v);
            else { if (!first) sb.append(' '); sb.append(st.query(l, r)); first = false; }
        }
        System.out.println(sb);
    }
}
