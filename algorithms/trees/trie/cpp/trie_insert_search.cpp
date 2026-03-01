#include <vector>
#include <string>
#include <unordered_map>

struct TrieNode {
    std::unordered_map<char, TrieNode*> children;
    bool isEnd = false;

    ~TrieNode() {
        for (auto& pair : children) {
            delete pair.second;
        }
    }
};

static void insert(TrieNode* root, int key) {
    TrieNode* node = root;
    std::string s = std::to_string(key);
    for (char ch : s) {
        if (node->children.find(ch) == node->children.end()) {
            node->children[ch] = new TrieNode();
        }
        node = node->children[ch];
    }
    node->isEnd = true;
}

static bool search(TrieNode* root, int key) {
    TrieNode* node = root;
    std::string s = std::to_string(key);
    for (char ch : s) {
        if (node->children.find(ch) == node->children.end()) {
            return false;
        }
        node = node->children[ch];
    }
    return node->isEnd;
}

int trieInsertSearch(std::vector<int> arr) {
    int n = static_cast<int>(arr.size());
    int mid = n / 2;
    TrieNode* root = new TrieNode();

    for (int i = 0; i < mid; i++) {
        insert(root, arr[i]);
    }

    int count = 0;
    for (int i = mid; i < n; i++) {
        if (search(root, arr[i])) {
            count++;
        }
    }

    delete root;
    return count;
}
