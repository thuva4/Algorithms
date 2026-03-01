using System;
using System.Collections.Generic;

namespace Algorithms.Searching.BestFirstSearch
{
    public class BestFirstSearch
    {
        private class Node : IComparable<Node>
        {
            public int Id;
            public int Heuristic;

            public Node(int id, int heuristic)
            {
                Id = id;
                Heuristic = heuristic;
            }

            public int CompareTo(Node other)
            {
                return this.Heuristic.CompareTo(other.Heuristic);
            }
        }

        public static List<int> Search(
            int n,
            List<List<int>> adj,
            int start,
            int target,
            int[] heuristic
        )
        {
            // Simple Priority Queue using SortedSet logic or MinHeap implementation needed.
            // Using a simple list and sorting for simplicity (less efficient but functional for small N)
            // Or better: PriorityQueue in .NET 6+. Assuming .NET 6+ environment.
            
            var pq = new PriorityQueue<int, int>();
            var visited = new bool[n];
            var parent = new int[n];
            for(int i=0; i<n; i++) parent[i] = -1;

            pq.Enqueue(start, heuristic[start]);
            visited[start] = true;

            bool found = false;

            while (pq.Count > 0)
            {
                int u = pq.Dequeue();

                if (u == target)
                {
                    found = true;
                    break;
                }

                foreach (int v in adj[u])
                {
                    if (!visited[v])
                    {
                        visited[v] = true;
                        parent[v] = u;
                        pq.Enqueue(v, heuristic[v]);
                    }
                }
            }

            var path = new List<int>();
            if (found)
            {
                int curr = target;
                while (curr != -1)
                {
                    path.Add(curr);
                    curr = parent[curr];
                }
                path.Reverse();
            }
            return path;
        }
    }
}
