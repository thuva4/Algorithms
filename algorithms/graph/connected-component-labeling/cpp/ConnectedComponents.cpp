#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>

using namespace std;

/**
 * Find all connected components in an undirected graph using DFS.
 */
class ConnectedComponents {
public:
    static vector<vector<int>> findComponents(unordered_map<int, vector<int>>& adjList) {
        unordered_set<int> visited;
        vector<vector<int>> components;

        int numNodes = adjList.size();
        for (int i = 0; i < numNodes; i++) {
            if (visited.find(i) == visited.end()) {
                vector<int> component;
                dfs(adjList, i, visited, component);
                components.push_back(component);
            }
        }

        return components;
    }

private:
    static void dfs(unordered_map<int, vector<int>>& adjList, int node,
                     unordered_set<int>& visited, vector<int>& component) {
        visited.insert(node);
        component.push_back(node);

        for (int neighbor : adjList[node]) {
            if (visited.find(neighbor) == visited.end()) {
                dfs(adjList, neighbor, visited, component);
            }
        }
    }
};

int main() {
    unordered_map<int, vector<int>> adjList = {
        {0, {1}},
        {1, {0}},
        {2, {3}},
        {3, {2}}
    };

    auto components = ConnectedComponents::findComponents(adjList);

    cout << "Connected components:" << endl;
    for (const auto& comp : components) {
        for (int node : comp) {
            cout << node << " ";
        }
        cout << endl;
    }

    return 0;
}
