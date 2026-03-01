public class GaussianElimination {

    public static int gaussianElimination(int[] arr) {
        int idx = 0; int n = arr[idx++];
        double[][] mat = new double[n][n+1];
        for (int i = 0; i < n; i++) for (int j = 0; j <= n; j++) mat[i][j] = arr[idx++];

        for (int col = 0; col < n; col++) {
            int maxRow = col;
            for (int row = col+1; row < n; row++)
                if (Math.abs(mat[row][col]) > Math.abs(mat[maxRow][col])) maxRow = row;
            double[] tmp = mat[col]; mat[col] = mat[maxRow]; mat[maxRow] = tmp;
            for (int row = col+1; row < n; row++) {
                if (mat[col][col] == 0) continue;
                double f = mat[row][col] / mat[col][col];
                for (int j = col; j <= n; j++) mat[row][j] -= f * mat[col][j];
            }
        }

        double[] sol = new double[n];
        for (int i = n-1; i >= 0; i--) {
            sol[i] = mat[i][n];
            for (int j = i+1; j < n; j++) sol[i] -= mat[i][j] * sol[j];
            sol[i] /= mat[i][i];
        }

        double sum = 0; for (double s : sol) sum += s;
        return (int) Math.round(sum);
    }

    public static void main(String[] args) {
        System.out.println(gaussianElimination(new int[]{2, 1, 1, 3, 2, 1, 4}));
        System.out.println(gaussianElimination(new int[]{2, 1, 0, 5, 0, 1, 3}));
        System.out.println(gaussianElimination(new int[]{1, 2, 6}));
        System.out.println(gaussianElimination(new int[]{3, 1, 1, 1, 6, 0, 2, 1, 5, 0, 0, 3, 9}));
    }
}
