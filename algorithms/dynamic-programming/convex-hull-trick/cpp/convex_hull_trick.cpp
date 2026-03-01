#include <limits>
#include <vector>

std::vector<long long> convex_hull_trick(
    int n,
    const std::vector<std::vector<int>>& lines,
    const std::vector<int>& queries
) {
    std::vector<long long> result;
    result.reserve(queries.size());

    for (int x : queries) {
        long long best = std::numeric_limits<long long>::max();
        for (int index = 0; index < n && index < static_cast<int>(lines.size()); ++index) {
            if (lines[index].size() < 2) {
                continue;
            }
            long long m = lines[index][0];
            long long b = lines[index][1];
            long long value = m * static_cast<long long>(x) + b;
            if (value < best) {
                best = value;
            }
        }
        result.push_back(best == std::numeric_limits<long long>::max() ? 0 : best);
    }

    return result;
}
