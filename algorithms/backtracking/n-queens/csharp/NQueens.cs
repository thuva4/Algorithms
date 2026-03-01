using System.Collections.Generic;

public class NQueens
{
    public static int NQueensSolve(int n)
    {
        if (n <= 0)
        {
            return 0;
        }

        var cols = new HashSet<int>();
        var diags = new HashSet<int>();
        var antiDiags = new HashSet<int>();
        int count = 0;

        void Backtrack(int row)
        {
            if (row == n)
            {
                count++;
                return;
            }
            for (int col = 0; col < n; col++)
            {
                if (cols.Contains(col) || diags.Contains(row - col) || antiDiags.Contains(row + col))
                {
                    continue;
                }
                cols.Add(col);
                diags.Add(row - col);
                antiDiags.Add(row + col);
                Backtrack(row + 1);
                cols.Remove(col);
                diags.Remove(row - col);
                antiDiags.Remove(row + col);
            }
        }

        Backtrack(0);
        return count;
    }
}
