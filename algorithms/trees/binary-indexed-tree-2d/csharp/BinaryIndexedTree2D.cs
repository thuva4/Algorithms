using System;
using System.Collections.Generic;

public class BinaryIndexedTree2D
{
    long[,] tree;
    int rows, cols;

    public BinaryIndexedTree2D(int rows, int cols)
    {
        this.rows = rows; this.cols = cols;
        tree = new long[rows + 1, cols + 1];
    }

    public void Update(int r, int c, long val)
    {
        for (int i = r + 1; i <= rows; i += i & (-i))
            for (int j = c + 1; j <= cols; j += j & (-j))
                tree[i, j] += val;
    }

    public long Query(int r, int c)
    {
        long s = 0;
        for (int i = r + 1; i > 0; i -= i & (-i))
            for (int j = c + 1; j > 0; j -= j & (-j))
                s += tree[i, j];
        return s;
    }

    public static void Main(string[] args)
    {
        var tokens = Console.ReadLine().Trim().Split();
        int idx = 0;
        int rows = int.Parse(tokens[idx++]), cols = int.Parse(tokens[idx++]);
        var bit = new BinaryIndexedTree2D(rows, cols);
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
            {
                int v = int.Parse(tokens[idx++]);
                if (v != 0) bit.Update(r, c, v);
            }
        int q = int.Parse(tokens[idx++]);
        var results = new List<string>();
        for (int i = 0; i < q; i++)
        {
            int t = int.Parse(tokens[idx++]), r = int.Parse(tokens[idx++]);
            int c = int.Parse(tokens[idx++]), v = int.Parse(tokens[idx++]);
            if (t == 1) bit.Update(r, c, v);
            else results.Add(bit.Query(r, c).ToString());
        }
        Console.WriteLine(string.Join(" ", results));
    }
}
