#include <algorithm>
#include <vector>

namespace {
void dfs_order(int node, const std::vector<std::vector<int>>& graph, std::vector<bool>& visited, std::vector<int>& order) {
    visited[node] = true;
    for (int next : graph[node]) {
        if (!visited[next]) {
            dfs_order(next, graph, visited, order);
        }
    }
    order.push_back(node);
}

void dfs_component(int node, const std::vector<std::vector<int>>& graph, std::vector<bool>& visited, std::vector<int>& component) {
    visited[node] = true;
    component.push_back(node);
    for (int next : graph[node]) {
        if (!visited[next]) {
            dfs_component(next, graph, visited, component);
        }
    }
}
}  // namespace

std::vector<std::vector<int>> find_sccs(const std::vector<std::vector<int>>& adjacency) {
    int n = static_cast<int>(adjacency.size());
    std::vector<std::vector<int>> transpose(n);
    for (int node = 0; node < n; ++node) {
        for (int next : adjacency[node]) {
            if (next >= 0 && next < n) {
                transpose[next].push_back(node);
            }
        }
    }

    std::vector<bool> visited(n, false);
    std::vector<int> order;
    order.reserve(n);
    for (int node = 0; node < n; ++node) {
        if (!visited[node]) {
            dfs_order(node, adjacency, visited, order);
        }
    }

    std::fill(visited.begin(), visited.end(), false);
    std::vector<std::vector<int>> components;

    for (std::vector<int>::reverse_iterator it = order.rbegin(); it != order.rend(); ++it) {
        int node = *it;
        if (visited[node]) {
            continue;
        }
        std::vector<int> component;
        dfs_component(node, transpose, visited, component);
        std::sort(component.begin(), component.end());
        components.push_back(component);
    }

    std::sort(components.begin(), components.end(), [](const std::vector<int>& lhs, const std::vector<int>& rhs) {
        if (lhs.empty() || rhs.empty()) {
            return lhs.size() < rhs.size();
        }
        return lhs.front() < rhs.front();
    });
    return components;
}
