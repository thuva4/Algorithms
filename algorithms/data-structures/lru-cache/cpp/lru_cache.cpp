#include <vector>
#include <unordered_map>
#include <list>

class LRUCache {
    int capacity;
    std::list<std::pair<int, int>> order;
    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> map;

public:
    LRUCache(int cap) : capacity(cap) {}

    int get(int key) {
        auto it = map.find(key);
        if (it == map.end()) {
            return -1;
        }
        order.splice(order.begin(), order, it->second);
        return it->second->second;
    }

    void put(int key, int value) {
        auto it = map.find(key);
        if (it != map.end()) {
            it->second->second = value;
            order.splice(order.begin(), order, it->second);
        } else {
            if (static_cast<int>(map.size()) == capacity) {
                auto& back = order.back();
                map.erase(back.first);
                order.pop_back();
            }
            order.emplace_front(key, value);
            map[key] = order.begin();
        }
    }
};

int lru_cache(std::vector<int> operations) {
    int capacity = operations[0];
    int opCount = operations[1];
    LRUCache cache(capacity);
    int resultSum = 0;
    int idx = 2;

    for (int i = 0; i < opCount; i++) {
        int opType = operations[idx];
        int key = operations[idx + 1];
        int value = operations[idx + 2];
        idx += 3;

        if (opType == 1) {
            cache.put(key, value);
        } else if (opType == 2) {
            resultSum += cache.get(key);
        }
    }

    return resultSum;
}
