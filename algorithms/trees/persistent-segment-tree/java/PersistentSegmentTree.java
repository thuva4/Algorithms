import java.util.*;

public class PersistentSegmentTree {
    static int[] left, right;
    static long[] val;
    static int cnt = 0;

    static int newNode(long v, int l, int r) {
        int id = cnt++;
        val[id] = v; left[id] = l; right[id] = r;
        return id;
    }

    static int build(int[] a, int s, int e) {
        if (s == e) return newNode(a[s], 0, 0);
        int m = (s + e) / 2;
        int l = build(a, s, m), r = build(a, m + 1, e);
        return newNode(val[l] + val[r], l, r);
    }

    static int update(int nd, int s, int e, int idx, int v) {
        if (s == e) return newNode(v, 0, 0);
        int m = (s + e) / 2;
        if (idx <= m) {
            int nl = update(left[nd], s, m, idx, v);
            return newNode(val[nl] + val[right[nd]], nl, right[nd]);
        } else {
            int nr = update(right[nd], m + 1, e, idx, v);
            return newNode(val[left[nd]] + val[nr], left[nd], nr);
        }
    }

    static long query(int nd, int s, int e, int l, int r) {
        if (r < s || e < l) return 0;
        if (l <= s && e <= r) return val[nd];
        int m = (s + e) / 2;
        return query(left[nd], s, m, l, r) + query(right[nd], m + 1, e, l, r);
    }

    public static long[] persistentSegmentTree(int n, int[] array, int[][] operations) {
        int maxNodes = Math.max(4 * Math.max(1, n) + operations.length * 20, 1);
        left = new int[maxNodes];
        right = new int[maxNodes];
        val = new long[maxNodes];
        cnt = 0;

        java.util.List<Integer> roots = new java.util.ArrayList<>();
        roots.add(build(array, 0, n - 1));
        java.util.List<Long> answers = new java.util.ArrayList<>();
        for (int[] operation : operations) {
            if (operation[0] == 1) {
                roots.add(update(roots.get(operation[1]), 0, n - 1, operation[2], operation[3]));
            } else {
                answers.add(query(roots.get(operation[1]), 0, n - 1, operation[2], operation[3]));
            }
        }
        long[] result = new long[answers.size()];
        for (int i = 0; i < answers.size(); i++) {
            result[i] = answers.get(i);
        }
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int q = sc.nextInt();
        int maxNodes = 4 * n + q * 20;
        left = new int[maxNodes]; right = new int[maxNodes]; val = new long[maxNodes];
        List<Integer> roots = new ArrayList<>();
        roots.add(build(a, 0, n - 1));
        StringBuilder sb = new StringBuilder();
        boolean first = true;
        for (int i = 0; i < q; i++) {
            int t = sc.nextInt(), a1 = sc.nextInt(), b1 = sc.nextInt(), c1 = sc.nextInt();
            if (t == 1) roots.add(update(roots.get(a1), 0, n - 1, b1, c1));
            else { if (!first) sb.append(' '); sb.append(query(roots.get(a1), 0, n - 1, b1, c1)); first = false; }
        }
        System.out.println(sb);
    }
}
