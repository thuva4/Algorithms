import java.util.Scanner;

public class SparseTable {

    private int[][] table;
    private int[] log;

    public SparseTable(int[] arr) {
        int n = arr.length;
        int k = 1;
        while ((1 << k) <= n) k++;
        table = new int[k][n];
        log = new int[n + 1];
        for (int i = 2; i <= n; i++) log[i] = log[i / 2] + 1;

        System.arraycopy(arr, 0, table[0], 0, n);
        for (int j = 1; j < k; j++)
            for (int i = 0; i + (1 << j) <= n; i++)
                table[j][i] = Math.min(table[j-1][i], table[j-1][i + (1 << (j-1))]);
    }

    public int query(int l, int r) {
        int k = log[r - l + 1];
        return Math.min(table[k][l], table[k][r - (1 << k) + 1]);
    }

    public static int[] sparseTable(int n, int[] array, int[][] queries) {
        SparseTable st = new SparseTable(array);
        int[] result = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            result[i] = st.query(queries[i][0], queries[i][1]);
        }
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        SparseTable st = new SparseTable(arr);
        int q = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int l = sc.nextInt(), r = sc.nextInt();
            if (i > 0) sb.append(' ');
            sb.append(st.query(l, r));
        }
        System.out.println(sb);
    }
}
