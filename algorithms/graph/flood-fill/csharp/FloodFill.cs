using System;

/// <summary>
/// Flood fill algorithm using DFS.
/// </summary>
public class FloodFill
{
    public static int[,] Fill(int[,] grid, int sr, int sc, int newValue)
    {
        int originalValue = grid[sr, sc];
        if (originalValue == newValue) return grid;

        int rows = grid.GetLength(0);
        int cols = grid.GetLength(1);

        void Dfs(int r, int c)
        {
            if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r, c] != originalValue)
                return;

            grid[r, c] = newValue;
            Dfs(r - 1, c);
            Dfs(r + 1, c);
            Dfs(r, c - 1);
            Dfs(r, c + 1);
        }

        Dfs(sr, sc);
        return grid;
    }

    public static void Main(string[] args)
    {
        int[,] grid = {
            { 1, 1, 1 },
            { 1, 1, 0 },
            { 1, 0, 1 }
        };

        Fill(grid, 0, 0, 2);

        Console.WriteLine("After flood fill:");
        for (int i = 0; i < grid.GetLength(0); i++)
        {
            for (int j = 0; j < grid.GetLength(1); j++)
                Console.Write(grid[i, j] + " ");
            Console.WriteLine();
        }
    }
}
