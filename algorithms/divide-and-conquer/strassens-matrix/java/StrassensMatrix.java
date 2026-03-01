public class StrassensMatrix {

    public static int[] strassensMatrix(int[] arr) {
        int n = arr[0];
        int[][] a = new int[n][n], b = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) {
                a[i][j] = arr[1 + i * n + j];
                b[i][j] = arr[1 + n * n + i * n + j];
            }

        int size = 1;
        while (size < n) size *= 2;

        int[][] pa = new int[size][size], pb = new int[size][size];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) {
                pa[i][j] = a[i][j];
                pb[i][j] = b[i][j];
            }

        int[][] result = multiply(pa, pb, size);

        int[] out = new int[n * n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                out[i * n + j] = result[i][j];
        return out;
    }

    private static int[][] multiply(int[][] a, int[][] b, int n) {
        int[][] c = new int[n][n];
        if (n == 1) { c[0][0] = a[0][0] * b[0][0]; return c; }

        int h = n / 2;
        int[][] a11 = sub(a, 0, 0, h), a12 = sub(a, 0, h, h);
        int[][] a21 = sub(a, h, 0, h), a22 = sub(a, h, h, h);
        int[][] b11 = sub(b, 0, 0, h), b12 = sub(b, 0, h, h);
        int[][] b21 = sub(b, h, 0, h), b22 = sub(b, h, h, h);

        int[][] m1 = multiply(add(a11, a22, h), add(b11, b22, h), h);
        int[][] m2 = multiply(add(a21, a22, h), b11, h);
        int[][] m3 = multiply(a11, sub2(b12, b22, h), h);
        int[][] m4 = multiply(a22, sub2(b21, b11, h), h);
        int[][] m5 = multiply(add(a11, a12, h), b22, h);
        int[][] m6 = multiply(sub2(a21, a11, h), add(b11, b12, h), h);
        int[][] m7 = multiply(sub2(a12, a22, h), add(b21, b22, h), h);

        int[][] c11 = add(sub2(add(m1, m4, h), m5, h), m7, h);
        int[][] c12 = add(m3, m5, h);
        int[][] c21 = add(m2, m4, h);
        int[][] c22 = add(sub2(add(m1, m3, h), m2, h), m6, h);

        for (int i = 0; i < h; i++)
            for (int j = 0; j < h; j++) {
                c[i][j] = c11[i][j]; c[i][j + h] = c12[i][j];
                c[i + h][j] = c21[i][j]; c[i + h][j + h] = c22[i][j];
            }
        return c;
    }

    private static int[][] sub(int[][] m, int r, int c, int sz) {
        int[][] res = new int[sz][sz];
        for (int i = 0; i < sz; i++)
            for (int j = 0; j < sz; j++)
                res[i][j] = m[r + i][c + j];
        return res;
    }

    private static int[][] add(int[][] a, int[][] b, int sz) {
        int[][] r = new int[sz][sz];
        for (int i = 0; i < sz; i++)
            for (int j = 0; j < sz; j++)
                r[i][j] = a[i][j] + b[i][j];
        return r;
    }

    private static int[][] sub2(int[][] a, int[][] b, int sz) {
        int[][] r = new int[sz][sz];
        for (int i = 0; i < sz; i++)
            for (int j = 0; j < sz; j++)
                r[i][j] = a[i][j] - b[i][j];
        return r;
    }
}
