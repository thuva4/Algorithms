import java.util.Scanner;

public class SqrtDecomposition {
    private int[] a;
    private long[] blocks;
    private int n, block;

    public SqrtDecomposition(int[] arr) {
        n = arr.length;
        block = Math.max(1, (int) Math.sqrt(n));
        a = arr.clone();
        blocks = new long[(n + block - 1) / block];
        for (int i = 0; i < n; i++) blocks[i / block] += a[i];
    }

    public long query(int l, int r) {
        long result = 0;
        int bl = l / block, br = r / block;
        if (bl == br) {
            for (int i = l; i <= r; i++) result += a[i];
        } else {
            for (int i = l; i < (bl + 1) * block; i++) result += a[i];
            for (int b = bl + 1; b < br; b++) result += blocks[b];
            for (int i = br * block; i <= r; i++) result += a[i];
        }
        return result;
    }

    public static long[] sqrtDecomposition(int n, int[] array, int[][] queries) {
        SqrtDecomposition sd = new SqrtDecomposition(array);
        long[] result = new long[queries.length];
        for (int i = 0; i < queries.length; i++) {
            result[i] = sd.query(queries[i][0], queries[i][1]);
        }
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        SqrtDecomposition sd = new SqrtDecomposition(arr);
        int q = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int l = sc.nextInt(), r = sc.nextInt();
            if (i > 0) sb.append(' ');
            sb.append(sd.query(l, r));
        }
        System.out.println(sb);
    }
}
