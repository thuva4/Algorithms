#include <vector>

std::vector<int> heap_sort_via_extract(std::vector<int> arr) {
    std::vector<int> heap;

    auto siftUp = [&](int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (heap[i] < heap[parent]) {
                std::swap(heap[i], heap[parent]);
                i = parent;
            } else break;
        }
    };

    auto siftDown = [&](int i, int size) {
        while (true) {
            int smallest = i;
            int left = 2 * i + 1, right = 2 * i + 2;
            if (left < size && heap[left] < heap[smallest]) smallest = left;
            if (right < size && heap[right] < heap[smallest]) smallest = right;
            if (smallest != i) {
                std::swap(heap[i], heap[smallest]);
                i = smallest;
            } else break;
        }
    };

    for (int val : arr) {
        heap.push_back(val);
        siftUp(static_cast<int>(heap.size()) - 1);
    }

    std::vector<int> result;
    int size = static_cast<int>(heap.size());
    for (int r = 0; r < static_cast<int>(arr.size()); r++) {
        result.push_back(heap[0]);
        size--;
        heap[0] = heap[size];
        heap.pop_back();
        if (!heap.empty()) siftDown(0, static_cast<int>(heap.size()));
    }

    return result;
}
