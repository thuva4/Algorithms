using System;
using System.Collections.Generic;

namespace Algorithms.Graph.AStarBidirectional
{
    public class AStarBidirectional
    {
        private class Node : IComparable<Node>
        {
            public int r, c;
            public int f, g;

            public int CompareTo(Node other)
            {
                return f.CompareTo(other.f);
            }
        }

        public static int Solve(int[] arr)
        {
            if (arr == null || arr.Length < 7) return -1;

            int rows = arr[0];
            int cols = arr[1];
            int sr = arr[2], sc = arr[3];
            int er = arr[4], ec = arr[5];
            int numObs = arr[6];

            if (arr.Length < 7 + 2 * numObs) return -1;

            if (sr < 0 || sr >= rows || sc < 0 || sc >= cols || er < 0 || er >= rows || ec < 0 || ec >= cols) return -1;
            if (sr == er && sc == ec) return 0;

            bool[,] grid = new bool[rows, cols];
            for (int i = 0; i < numObs; i++)
            {
                int r = arr[7 + 2 * i];
                int c = arr[7 + 2 * i + 1];
                if (r >= 0 && r < rows && c >= 0 && c < cols)
                {
                    grid[r, c] = true;
                }
            }

            if (grid[sr, sc] || grid[er, ec]) return -1;

            var openF = new PriorityQueue<Node, int>();
            var openB = new PriorityQueue<Node, int>();

            int[,] gF = new int[rows, cols];
            int[,] gB = new int[rows, cols];

            for(int r=0; r<rows; r++)
                for(int c=0; c<cols; c++)
                {
                    gF[r,c] = int.MaxValue;
                    gB[r,c] = int.MaxValue;
                }

            int startH = Math.Abs(sr - er) + Math.Abs(sc - ec);
            gF[sr, sc] = 0;
            openF.Enqueue(new Node { r = sr, c = sc, f = startH, g = 0 }, startH);

            int endH = Math.Abs(er - sr) + Math.Abs(ec - sc);
            gB[er, ec] = 0;
            openB.Enqueue(new Node { r = er, c = ec, f = endH, g = 0 }, endH);

            int bestPath = int.MaxValue;
            int[] dr = { -1, 1, 0, 0 };
            int[] dc = { 0, 0, -1, 1 };

            while (openF.Count > 0 && openB.Count > 0)
            {
                // Forward
                if (openF.Count > 0)
                {
                    Node u = openF.Dequeue();
                    if (u.g <= gF[u.r, u.c])
                    {
                        for (int i = 0; i < 4; i++)
                        {
                            int nr = u.r + dr[i];
                            int nc = u.c + dc[i];

                            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr, nc])
                            {
                                int newG = u.g + 1;
                                if (newG < gF[nr, nc])
                                {
                                    gF[nr, nc] = newG;
                                    int h = Math.Abs(nr - er) + Math.Abs(nc - ec);
                                    openF.Enqueue(new Node { r = nr, c = nc, f = newG + h, g = newG }, newG + h);

                                    if (gB[nr, nc] != int.MaxValue)
                                    {
                                        bestPath = Math.Min(bestPath, newG + gB[nr, nc]);
                                    }
                                }
                            }
                        }
                    }
                }

                // Backward
                if (openB.Count > 0)
                {
                    Node u = openB.Dequeue();
                    if (u.g <= gB[u.r, u.c])
                    {
                        for (int i = 0; i < 4; i++)
                        {
                            int nr = u.r + dr[i];
                            int nc = u.c + dc[i];

                            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr, nc])
                            {
                                int newG = u.g + 1;
                                if (newG < gB[nr, nc])
                                {
                                    gB[nr, nc] = newG;
                                    int h = Math.Abs(nr - sr) + Math.Abs(nc - sc);
                                    openB.Enqueue(new Node { r = nr, c = nc, f = newG + h, g = newG }, newG + h);

                                    if (gF[nr, nc] != int.MaxValue)
                                    {
                                        bestPath = Math.Min(bestPath, newG + gF[nr, nc]);
                                    }
                                }
                            }
                        }
                    }
                }

                int minF = openF.Count > 0 ? openF.Peek().f : int.MaxValue;
                int minB = openB.Count > 0 ? openB.Peek().f : int.MaxValue;

                if (bestPath != int.MaxValue && (long)minF + minB >= bestPath) break;
            }

            return bestPath == int.MaxValue ? -1 : bestPath;
        }
    }
}
