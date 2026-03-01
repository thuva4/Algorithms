#include <limits>
#include <queue>
#include <utility>
#include <vector>

int prim(int num_vertices, const std::vector<std::vector<std::vector<int>>>& graph) {
    if (num_vertices <= 0) {
        return 0;
    }

    using QueueItem = std::pair<int, int>;
    std::priority_queue<QueueItem, std::vector<QueueItem>, std::greater<QueueItem>> min_heap;
    std::vector<bool> visited(num_vertices, false);

    min_heap.push({0, 0});
    int visited_count = 0;
    int total_weight = 0;

    while (!min_heap.empty() && visited_count < num_vertices) {
        std::pair<int, int> current = min_heap.top();
        min_heap.pop();

        int weight = current.first;
        int node = current.second;
        if (node < 0 || node >= num_vertices || visited[node]) {
            continue;
        }

        visited[node] = true;
        ++visited_count;
        total_weight += weight;

        if (node >= static_cast<int>(graph.size())) {
            continue;
        }
        for (const std::vector<int>& edge : graph[node]) {
            if (edge.size() < 2) {
                continue;
            }
            int next = edge[0];
            int next_weight = edge[1];
            if (next >= 0 && next < num_vertices && !visited[next]) {
                min_heap.push({next_weight, next});
            }
        }
    }

    return visited_count == num_vertices ? total_weight : 0;
}
