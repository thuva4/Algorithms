#include <iostream>
#include <vector>
using namespace std;

class UnionFind {
    vector<int> parent;
    vector<int> rank_;

public:
    UnionFind(int n) : parent(n), rank_(n, 0) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }

    void unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return;
        if (rank_[px] < rank_[py]) swap(px, py);
        parent[py] = px;
        if (rank_[px] == rank_[py]) rank_[px]++;
    }

    bool connected(int x, int y) {
        return find(x) == find(y);
    }
};

int main() {
    UnionFind uf(5);
    uf.unite(0, 1);
    uf.unite(1, 2);
    cout << "0 and 2 connected: " << (uf.connected(0, 2) ? "true" : "false") << endl;
    cout << "0 and 3 connected: " << (uf.connected(0, 3) ? "true" : "false") << endl;
    return 0;
}
#include <numeric>
#include <string>
#include <vector>

namespace {

int find_root(std::vector<int>& parent, int node) {
    if (parent[node] != node) {
        parent[node] = find_root(parent, parent[node]);
    }
    return parent[node];
}

void unite(std::vector<int>& parent, std::vector<int>& rank, int a, int b) {
    int root_a = find_root(parent, a);
    int root_b = find_root(parent, b);
    if (root_a == root_b) {
        return;
    }
    if (rank[root_a] < rank[root_b]) {
        std::swap(root_a, root_b);
    }
    parent[root_b] = root_a;
    if (rank[root_a] == rank[root_b]) {
        ++rank[root_a];
    }
}

}  // namespace

std::vector<bool> union_find_operations(int n, const std::vector<std::vector<std::string>>& operations) {
    std::vector<int> parent(n);
    std::iota(parent.begin(), parent.end(), 0);
    std::vector<int> rank(n, 0);
    std::vector<bool> result;

    for (const std::vector<std::string>& operation : operations) {
        if (operation.size() < 3) {
            continue;
        }
        int a = std::stoi(operation[1]);
        int b = std::stoi(operation[2]);
        if (operation[0] == "union") {
            unite(parent, rank, a, b);
        } else if (operation[0] == "find") {
            result.push_back(find_root(parent, a) == find_root(parent, b));
        }
    }

    return result;
}
