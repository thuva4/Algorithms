#include <vector>
#include <queue>

int queue_ops(std::vector<int> arr) {
    if (arr.empty()) return 0;
    std::queue<int> q;
    int opCount = arr[0], idx = 1, total = 0;
    for (int i = 0; i < opCount; i++) {
        int type = arr[idx], val = arr[idx + 1]; idx += 2;
        if (type == 1) q.push(val);
        else if (type == 2 && !q.empty()) { total += q.front(); q.pop(); }
    }
    return total;
}
