public class MatrixDeterminant {

    public static int matrixDeterminant(int[] arr) {
        int idx = 0; int n = arr[idx++];
        double[][] mat = new double[n][n];
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) mat[i][j] = arr[idx++];

        double det = 1.0;
        for (int col = 0; col < n; col++) {
            int maxRow = col;
            for (int row = col+1; row < n; row++)
                if (Math.abs(mat[row][col]) > Math.abs(mat[maxRow][col])) maxRow = row;
            if (maxRow != col) { double[] t = mat[col]; mat[col] = mat[maxRow]; mat[maxRow] = t; det *= -1; }
            if (mat[col][col] == 0) return 0;
            det *= mat[col][col];
            for (int row = col+1; row < n; row++) {
                double f = mat[row][col] / mat[col][col];
                for (int j = col+1; j < n; j++) mat[row][j] -= f * mat[col][j];
            }
        }
        return (int) Math.round(det);
    }

    public static void main(String[] args) {
        System.out.println(matrixDeterminant(new int[]{2, 1, 2, 3, 4}));
        System.out.println(matrixDeterminant(new int[]{2, 1, 0, 0, 1}));
        System.out.println(matrixDeterminant(new int[]{3, 6, 1, 1, 4, -2, 5, 2, 8, 7}));
        System.out.println(matrixDeterminant(new int[]{1, 5}));
    }
}
