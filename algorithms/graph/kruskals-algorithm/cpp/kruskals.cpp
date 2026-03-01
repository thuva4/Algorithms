#include <algorithm>
#include <numeric>
#include <vector>

namespace {
struct Edge {
    int from;
    int to;
    int weight;
};

int find_parent(int node, std::vector<int>& parent) {
    if (parent[node] != node) {
        parent[node] = find_parent(parent[node], parent);
    }
    return parent[node];
}
}  // namespace

int kruskal(int num_vertices, const std::vector<std::vector<int>>& edges_input) {
    std::vector<Edge> edges;
    edges.reserve(edges_input.size());
    for (const std::vector<int>& edge : edges_input) {
        if (edge.size() >= 3) {
            edges.push_back(Edge{edge[0], edge[1], edge[2]});
        }
    }

    std::sort(edges.begin(), edges.end(), [](const Edge& lhs, const Edge& rhs) {
        return lhs.weight < rhs.weight;
    });

    std::vector<int> parent(num_vertices);
    std::vector<int> rank(num_vertices, 0);
    std::iota(parent.begin(), parent.end(), 0);

    int used = 0;
    int total = 0;
    for (const Edge& edge : edges) {
        if (edge.from < 0 || edge.from >= num_vertices || edge.to < 0 || edge.to >= num_vertices) {
            continue;
        }
        int root_a = find_parent(edge.from, parent);
        int root_b = find_parent(edge.to, parent);
        if (root_a == root_b) {
            continue;
        }

        if (rank[root_a] < rank[root_b]) {
            std::swap(root_a, root_b);
        }
        parent[root_b] = root_a;
        if (rank[root_a] == rank[root_b]) {
            ++rank[root_a];
        }

        total += edge.weight;
        ++used;
        if (used == num_vertices - 1) {
            break;
        }
    }

    return used == std::max(0, num_vertices - 1) ? total : 0;
}
