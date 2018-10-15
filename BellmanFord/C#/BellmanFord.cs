using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bellman_Ford_Algorithm
{
        class Program
        {
            static void Main(string[] args)
            {
                int noOfVertices = 5;
                int noOfEdges = 7;
                Graph graph = new Graph(noOfVertices, noOfEdges);
                graph.edgesList.Add(new Edge(0, 1, 4));
                graph.edgesList.Add(new Edge(0, 2, 5));
                graph.edgesList.Add(new Edge(0, 3, 8));
                graph.edgesList.Add(new Edge(1, 2, -3));
                graph.edgesList.Add(new Edge(2, 4, 4));
                graph.edgesList.Add(new Edge(3, 4, 2));
                graph.edgesList.Add(new Edge(4, 3, 1));
                //int noOfVertices = 5;
                //int noOfEdges = 7;
                //Graph graph = new Graph(noOfVertices, noOfEdges);
                //graph.edgesList.Add(new Edge(0, 1, -1));1
                //graph.edgesList.Add(new Edge(0, 2, 4));
                //graph.edgesList.Add(new Edge(1, 2, 3));
                //graph.edgesList.Add(new Edge(1, 3, 2));
                //graph.edgesList.Add(new Edge(1, 4, 2));
                //graph.edgesList.Add(new Edge(3, 2, 5));
                //graph.edgesList.Add(new Edge(3, 1, 1));
                //graph.edgesList.Add(new Edge(4, 3, -3));

                BellmanFord(graph, 0);

                Console.ReadLine();

            }

            public static void BellmanFord(Graph g, int src)
            {
                int V = g.vertices;
                int E = g.edges;
                int[] distance = new int[V];
                int[] parent = new int[V];

                for (int i = 0; i < V; i++)
                    distance[i] = int.MaxValue;

                distance[src] = 0;

                for (int i = 1; i <= V-1; i++)
{
                    for (int j = 0; j < E; j++)
                    {
                        int u = g.edgesList[j].src;
                        int v = g.edgesList[j].dest;
                        int weight = g.edgesList[j].weight;

                        if (distance[u] != int.MaxValue && distance[u] + weight < distance[v])
                        {
                            distance[v] = distance[u] + weight;
                            parent[v] = u;
                        }

                    }
                }

                printArr(distance, parent, V);

            }

            private static void printArr(int[] distance, int[] parent, int v)
            {
                Console.WriteLine("Vertex \t Distance \t Parent");
                for (int i = 0; i < v; ++i)
                    Console.WriteLine("{0} \t\t {1} \t\t {2} \n", i, distance[i], parent[i]);
            }
        }

        public class Graph
        {
            public List<Edge> edgesList;
            public int vertices, edges;

            public LinkedList<int>[] adjList;

            public Graph(int vertices, int edges)
            {
                this.vertices = vertices;
                this.edges = edges;
                edgesList = new List<Edge>(edges);
            }

        }

        public class Edge
        {
            public int src, dest;
            public int weight;

            public Edge(int src, int dest, int weight)
            {
                this.src = src;
                this.dest = dest;
                this.weight = weight;
            }
        }
    }
