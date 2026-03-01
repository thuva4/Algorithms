#include <vector>

int priority_queue_ops(std::vector<int> arr) {
    if (arr.empty()) return 0;

    std::vector<int> heap;

    auto siftUp = [&](int i) {
        while (i > 0) {
            int p = (i - 1) / 2;
            if (heap[i] < heap[p]) { std::swap(heap[i], heap[p]); i = p; }
            else break;
        }
    };

    auto siftDown = [&](int i) {
        int sz = static_cast<int>(heap.size());
        while (true) {
            int s = i, l = 2*i+1, r = 2*i+2;
            if (l < sz && heap[l] < heap[s]) s = l;
            if (r < sz && heap[r] < heap[s]) s = r;
            if (s != i) { std::swap(heap[i], heap[s]); i = s; }
            else break;
        }
    };

    int opCount = arr[0];
    int idx = 1;
    int total = 0;

    for (int i = 0; i < opCount; i++) {
        int type = arr[idx], val = arr[idx+1];
        idx += 2;
        if (type == 1) {
            heap.push_back(val);
            siftUp(static_cast<int>(heap.size()) - 1);
        } else if (type == 2) {
            if (heap.empty()) continue;
            total += heap[0];
            heap[0] = heap.back();
            heap.pop_back();
            if (!heap.empty()) siftDown(0);
        }
    }
    return total;
}
