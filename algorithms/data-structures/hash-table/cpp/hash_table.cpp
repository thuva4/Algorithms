#include <vector>
#include <list>
#include <utility>
#include <cstdlib>

class HashTable {
    int size;
    std::vector<std::list<std::pair<int, int>>> buckets;

    int hash(int key) const {
        return std::abs(key) % size;
    }

public:
    HashTable(int size = 64) : size(size), buckets(size) {}

    void put(int key, int value) {
        int idx = hash(key);
        for (auto& entry : buckets[idx]) {
            if (entry.first == key) {
                entry.second = value;
                return;
            }
        }
        buckets[idx].emplace_back(key, value);
    }

    int get(int key) {
        int idx = hash(key);
        for (const auto& entry : buckets[idx]) {
            if (entry.first == key) {
                return entry.second;
            }
        }
        return -1;
    }

    void remove(int key) {
        int idx = hash(key);
        buckets[idx].remove_if([key](const std::pair<int, int>& entry) {
            return entry.first == key;
        });
    }
};

int hashTableOps(std::vector<int> operations) {
    HashTable table;
    int opCount = operations[0];
    int resultSum = 0;
    int idx = 1;

    for (int i = 0; i < opCount; i++) {
        int opType = operations[idx];
        int key = operations[idx + 1];
        int value = operations[idx + 2];
        idx += 3;

        if (opType == 1) {
            table.put(key, value);
        } else if (opType == 2) {
            resultSum += table.get(key);
        } else if (opType == 3) {
            table.remove(key);
        }
    }

    return resultSum;
}
