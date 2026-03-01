import java.util.*;

public class BinaryIndexedTree2D {
    long[][] tree;
    int rows, cols;

    public BinaryIndexedTree2D(int rows, int cols) {
        this.rows = rows; this.cols = cols;
        tree = new long[rows + 1][cols + 1];
    }

    public void update(int r, int c, long val) {
        for (int i = r + 1; i <= rows; i += i & (-i))
            for (int j = c + 1; j <= cols; j += j & (-j))
                tree[i][j] += val;
    }

    public long query(int r, int c) {
        long s = 0;
        for (int i = r + 1; i > 0; i -= i & (-i))
            for (int j = c + 1; j > 0; j -= j & (-j))
                s += tree[i][j];
        return s;
    }

    public static long[] binaryIndexedTree2d(int rows, int cols, int[][] matrix, int[][] operations) {
        BinaryIndexedTree2D bit = new BinaryIndexedTree2D(rows, cols);
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (matrix[r][c] != 0) {
                    bit.update(r, c, matrix[r][c]);
                }
            }
        }
        java.util.List<Long> answers = new java.util.ArrayList<>();
        for (int[] operation : operations) {
            if (operation[0] == 1) {
                bit.update(operation[1], operation[2], operation[3]);
            } else {
                answers.add(bit.query(operation[1], operation[2]));
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
        int rows = sc.nextInt(), cols = sc.nextInt();
        BinaryIndexedTree2D bit = new BinaryIndexedTree2D(rows, cols);
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++) {
                int v = sc.nextInt();
                if (v != 0) bit.update(r, c, v);
            }
        int q = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        boolean first = true;
        for (int i = 0; i < q; i++) {
            int t = sc.nextInt(), r = sc.nextInt(), c = sc.nextInt(), v = sc.nextInt();
            if (t == 1) bit.update(r, c, v);
            else { if (!first) sb.append(' '); sb.append(bit.query(r, c)); first = false; }
        }
        System.out.println(sb);
    }
}
