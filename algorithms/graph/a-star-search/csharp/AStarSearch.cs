using System;
using System.Collections.Generic;

namespace Algorithms.Graph.AStarSearch
{
    public class AStarSearch
    {
        private class Node : IComparable<Node>
        {
            public int id;
            public int f, g;

            public int CompareTo(Node other)
            {
                return f.CompareTo(other.f);
            }
        }

        private class Edge
        {
            public int to;
            public int weight;
        }

        public static int Solve(int[] arr)
        {
            if (arr == null || arr.Length < 2) return -1;

            int n = arr[0];
            int m = arr[1];

            if (arr.Length < 2 + 3 * m + 2 + n) return -1;

            int start = arr[2 + 3 * m];
            int goal = arr[2 + 3 * m + 1];

            if (start < 0 || start >= n || goal < 0 || goal >= n) return -1;
            if (start == goal) return 0;

            List<Edge>[] adj = new List<Edge>[n];
            for (int i = 0; i < n; i++) adj[i] = new List<Edge>();

            for (int i = 0; i < m; i++)
            {
                int u = arr[2 + 3 * i];
                int v = arr[2 + 3 * i + 1];
                int w = arr[2 + 3 * i + 2];

                if (u >= 0 && u < n && v >= 0 && v < n)
                {
                    adj[u].Add(new Edge { to = v, weight = w });
                }
            }

            int hIndex = 2 + 3 * m + 2;
            
            var openSet = new PriorityQueue<Node, int>();
            int[] gScore = new int[n];
            Array.Fill(gScore, int.MaxValue);

            gScore[start] = 0;
            openSet.Enqueue(new Node { id = start, f = arr[hIndex + start], g = 0 }, arr[hIndex + start]);

            while (openSet.Count > 0)
            {
                Node current = openSet.Dequeue();
                int u = current.id;

                if (u == goal) return current.g;

                if (current.g > gScore[u]) continue;

                foreach (var e in adj[u])
                {
                    int v = e.to;
                    int w = e.weight;

                    if (gScore[u] != int.MaxValue && (long)gScore[u] + w < gScore[v])
                    {
                        gScore[v] = gScore[u] + w;
                        int f = gScore[v] + arr[hIndex + v];
                        openSet.Enqueue(new Node { id = v, f = f, g = gScore[v] }, f);
                    }
                }
            }

            return -1;
        }
    }
}
