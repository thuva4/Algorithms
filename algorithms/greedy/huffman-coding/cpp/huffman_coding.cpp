#include <vector>
#include <queue>

int huffmanCoding(std::vector<int> frequencies) {
    if (frequencies.size() <= 1) {
        return 0;
    }

    std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;
    for (int freq : frequencies) {
        minHeap.push(freq);
    }

    int totalCost = 0;
    while (minHeap.size() > 1) {
        int left = minHeap.top(); minHeap.pop();
        int right = minHeap.top(); minHeap.pop();
        int merged = left + right;
        totalCost += merged;
        minHeap.push(merged);
    }

    return totalCost;
}
