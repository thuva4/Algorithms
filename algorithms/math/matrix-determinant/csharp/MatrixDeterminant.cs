using System;

class MatrixDeterminant
{
    public static int Solve(int[] arr)
    {
        int idx = 0;
        int n = arr[idx++];
        double[,] mat = new double[n, n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                mat[i, j] = arr[idx++];

        double det = 1.0;
        for (int col = 0; col < n; col++)
        {
            int maxRow = col;
            for (int row = col + 1; row < n; row++)
            {
                if (Math.Abs(mat[row, col]) > Math.Abs(mat[maxRow, col]))
                    maxRow = row;
            }
            if (maxRow != col)
            {
                for (int j = 0; j < n; j++)
                {
                    double tmp = mat[col, j];
                    mat[col, j] = mat[maxRow, j];
                    mat[maxRow, j] = tmp;
                }
                det *= -1.0;
            }
            if (mat[col, col] == 0.0) return 0;
            det *= mat[col, col];
            for (int row = col + 1; row < n; row++)
            {
                double factor = mat[row, col] / mat[col, col];
                for (int j = col + 1; j < n; j++)
                    mat[row, j] -= factor * mat[col, j];
            }
        }
        return (int)Math.Round(det);
    }

    static void Main()
    {
        Console.WriteLine(Solve(new int[] { 2, 1, 2, 3, 4 }));
        Console.WriteLine(Solve(new int[] { 2, 1, 0, 0, 1 }));
        Console.WriteLine(Solve(new int[] { 3, 6, 1, 1, 4, -2, 5, 2, 8, 7 }));
        Console.WriteLine(Solve(new int[] { 1, 5 }));
    }
}
