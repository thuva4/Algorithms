#include <algorithm>
#include <vector>

namespace {
int minimax_impl(int depth, int node_index, bool is_max, const std::vector<int>& scores, int max_depth) {
    if (depth == max_depth) {
        return scores[node_index];
    }

    int left = minimax_impl(depth + 1, node_index * 2, !is_max, scores, max_depth);
    int right = minimax_impl(depth + 1, node_index * 2 + 1, !is_max, scores, max_depth);
    return is_max ? std::max(left, right) : std::min(left, right);
}
}  // namespace

int minimax(const std::vector<int>& tree_values, int depth, bool is_maximizing) {
    if (tree_values.empty()) {
        return 0;
    }
    if (depth <= 0 || tree_values.size() == 1) {
        return tree_values.front();
    }

    std::vector<int> padded = tree_values;
    int leaf_count = 1;
    while (leaf_count < static_cast<int>(padded.size())) {
        leaf_count <<= 1;
    }
    padded.resize(leaf_count, padded.back());

    return minimax_impl(0, 0, is_maximizing, padded, depth);
}
