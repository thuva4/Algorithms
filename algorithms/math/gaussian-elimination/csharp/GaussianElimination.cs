using System;

public class GaussianElimination
{
    public static int Solve(int[] arr)
    {
        int idx = 0, n = arr[idx++];
        double[,] mat = new double[n, n + 1];
        for (int i = 0; i < n; i++) for (int j = 0; j <= n; j++) mat[i, j] = arr[idx++];

        for (int col = 0; col < n; col++)
        {
            int maxRow = col;
            for (int row = col + 1; row < n; row++)
                if (Math.Abs(mat[row, col]) > Math.Abs(mat[maxRow, col])) maxRow = row;
            for (int j = 0; j <= n; j++) { double t = mat[col, j]; mat[col, j] = mat[maxRow, j]; mat[maxRow, j] = t; }
            for (int row = col + 1; row < n; row++)
            {
                if (mat[col, col] == 0) continue;
                double f = mat[row, col] / mat[col, col];
                for (int j = col; j <= n; j++) mat[row, j] -= f * mat[col, j];
            }
        }

        double[] sol = new double[n];
        for (int i = n - 1; i >= 0; i--)
        {
            sol[i] = mat[i, n];
            for (int j = i + 1; j < n; j++) sol[i] -= mat[i, j] * sol[j];
            sol[i] /= mat[i, i];
        }

        double sum = 0; foreach (double s in sol) sum += s;
        return (int)Math.Round(sum);
    }

    static void Main(string[] args)
    {
        Console.WriteLine(Solve(new int[] { 2, 1, 1, 3, 2, 1, 4 }));
        Console.WriteLine(Solve(new int[] { 2, 1, 0, 5, 0, 1, 3 }));
        Console.WriteLine(Solve(new int[] { 1, 2, 6 }));
        Console.WriteLine(Solve(new int[] { 3, 1, 1, 1, 6, 0, 2, 1, 5, 0, 0, 3, 9 }));
    }
}
