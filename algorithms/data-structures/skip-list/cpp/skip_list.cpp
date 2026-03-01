#include <vector>
#include <cstdlib>
#include <climits>

static const int MAX_LEVEL = 16;

struct SkipNode {
    int key;
    std::vector<SkipNode*> forward;
    SkipNode(int k, int level) : key(k), forward(level + 1, nullptr) {}
};

std::vector<int> skip_list(std::vector<int> arr) {
    SkipNode* header = new SkipNode(INT_MIN, MAX_LEVEL);
    int level = 0;

    for (int val : arr) {
        std::vector<SkipNode*> update(MAX_LEVEL + 1, nullptr);
        SkipNode* current = header;
        for (int i = level; i >= 0; i--) {
            while (current->forward[i] && current->forward[i]->key < val)
                current = current->forward[i];
            update[i] = current;
        }
        current = current->forward[0];
        if (current && current->key == val) continue;

        int newLevel = 0;
        while (rand() % 2 && newLevel < MAX_LEVEL) newLevel++;
        if (newLevel > level) {
            for (int i = level + 1; i <= newLevel; i++) update[i] = header;
            level = newLevel;
        }
        SkipNode* newNode = new SkipNode(val, newLevel);
        for (int i = 0; i <= newLevel; i++) {
            newNode->forward[i] = update[i]->forward[i];
            update[i]->forward[i] = newNode;
        }
    }

    std::vector<int> result;
    SkipNode* node = header->forward[0];
    while (node) {
        result.push_back(node->key);
        node = node->forward[0];
    }

    // Cleanup
    node = header;
    while (node) {
        SkipNode* next = node->forward[0];
        delete node;
        node = next;
    }
    return result;
}
