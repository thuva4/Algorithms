#include <vector>

int stack_ops(std::vector<int> arr) {
    if (arr.empty()) return 0;
    std::vector<int> stack;
    int opCount = arr[0], idx = 1, total = 0;
    for (int i = 0; i < opCount; i++) {
        int type = arr[idx], val = arr[idx + 1];
        idx += 2;
        if (type == 1) stack.push_back(val);
        else if (type == 2) {
            if (!stack.empty()) { total += stack.back(); stack.pop_back(); }
            else total += -1;
        }
    }
    return total;
}
