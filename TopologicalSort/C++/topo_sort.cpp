/*
* @author Abhishek Datta
* @github_id abdatta
* @since 15th October, 2017
*
* The following algroithm creates a directed acyclic graph
* and displays the topological order of its vertices
* 
* Topological sorting for Directed Acyclic Graph (DAG) is a
* linear ordering of vertices such that for every directed
* edge uv, vertex u comes before v in the ordering.
*/

#include <iostream>
#include <list>
using namespace std;

// This class represents a directed graph using adjacency list representation
class Graph
{
	int V; // No. of vertices
	list<int> *adj; // Pointer to an array containing adjacency lists
	list<int> sorted_list; // The list of vertices sorted in topological order

	public:
		Graph(int V) // Contsructor
		{
			this->V = V;
			this->adj = new list<int>[V];
		}

		void addEdge(int from, int to) // Function to add an edge to the graph
		{
			this->adj[from].push_back(to); // Add 'to' to the adjecency list of 'from'
		}

		void dfs_explore(bool *visited, int start) // Starts performing DFS from the given 'start' vertex
		{
			visited[start] = true; // Mark this vertex as visited

			// iterate over all the adjecent vertices and perform DFS on them if they are not visited yet
			for (list<int>::iterator i = this->adj[start].begin(); i != this->adj[start].end(); ++i)
			{
				if(!visited[*i]) // if not yet visited
				{
					dfs_explore(visited, *i); // perform DFS
				}
			}

			// This is the most important part of topological sort
			// The first vertex to finish exploration will be the last vertex in the topological sort
			// So ordering the vertices in the reverse of their finished order will give us the sorted list
			this->sorted_list.push_front(start);
		}

		void dfs()
		{
			bool *visited = new bool[this->V]; // variable to keep track of visited vertices
			for(int i = 0; i<this->V; i++)
				visited[i] = false; // initialise all vertices as not visited yet

			for (int i = 0; i < this->V; ++i) // iterate through all vertices
			{
				if(!visited[i]) // if a vertiex is not yet visited
				{
					dfs_explore(visited, i); // perform DFS on it
				}
			}
		}

		void topo_sort()
		{
			dfs(); // perform dfs to create the sorted_list

			// iterate over the sorted_list to display them in order
			for (std::list<int>::iterator i = this->sorted_list.begin(); i != this->sorted_list.end(); ++i)
			{
				cout<<*i<<" ";
			}
			cout<<endl;
		}
};

// main method to try the topological sort
int main()
{
	// create a graph of 8 vertices
	Graph g(8);
	// add edges to it
    g.addEdge(0, 1);	/*    0  ----------   2          */
    g.addEdge(0, 2);	/*      \          /  |  \       */
    g.addEdge(1, 4);	/*        1 --- 4 --- 3    6     */
    g.addEdge(4, 2);	/*      /          \  |  /       */
    g.addEdge(4, 5);	/*    7  ----------   5          */
    g.addEdge(2, 3);
    g.addEdge(3, 5);
    g.addEdge(2, 6);
	g.addEdge(5, 6);
	g.addEdge(7, 5);

    g.topo_sort();
    return 0;
}