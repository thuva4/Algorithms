#include <vector>

static int nextPos(const std::vector<int>& arr, int pos) {
    int n = static_cast<int>(arr.size());
    if (pos < 0 || pos >= n || arr[pos] == -1) {
        return -1;
    }
    return arr[pos];
}

int detectCycle(std::vector<int> arr) {
    if (arr.empty()) {
        return -1;
    }

    int tortoise = 0;
    int hare = 0;

    // Phase 1: Detect cycle
    while (true) {
        tortoise = nextPos(arr, tortoise);
        if (tortoise == -1) return -1;

        hare = nextPos(arr, hare);
        if (hare == -1) return -1;
        hare = nextPos(arr, hare);
        if (hare == -1) return -1;

        if (tortoise == hare) break;
    }

    // Phase 2: Find cycle start
    int pointer1 = 0;
    int pointer2 = tortoise;
    while (pointer1 != pointer2) {
        pointer1 = arr[pointer1];
        pointer2 = arr[pointer2];
    }

    return pointer1;
}
