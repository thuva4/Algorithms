#include <vector>
#include <algorithm>

static const int T = 3;

struct BTreeNode {
    int keys[2 * T - 1];
    BTreeNode* children[2 * T];
    int n;
    bool leaf;
    BTreeNode() : n(0), leaf(true) {
        for (int i = 0; i < 2 * T; i++) children[i] = nullptr;
    }
    ~BTreeNode() {
        if (!leaf) {
            for (int i = 0; i <= n; i++) {
                delete children[i];
            }
        }
    }
};

static void splitChild(BTreeNode* parent, int i) {
    BTreeNode* full = parent->children[i];
    BTreeNode* newNode = new BTreeNode();
    newNode->leaf = full->leaf;
    newNode->n = T - 1;
    for (int j = 0; j < T - 1; j++) {
        newNode->keys[j] = full->keys[j + T];
    }
    if (!full->leaf) {
        for (int j = 0; j < T; j++) {
            newNode->children[j] = full->children[j + T];
            full->children[j + T] = nullptr;
        }
    }
    for (int j = parent->n; j > i; j--) {
        parent->children[j + 1] = parent->children[j];
    }
    parent->children[i + 1] = newNode;
    for (int j = parent->n - 1; j >= i; j--) {
        parent->keys[j + 1] = parent->keys[j];
    }
    parent->keys[i] = full->keys[T - 1];
    full->n = T - 1;
    parent->n++;
}

static void insertNonFull(BTreeNode* node, int key) {
    int i = node->n - 1;
    if (node->leaf) {
        while (i >= 0 && key < node->keys[i]) {
            node->keys[i + 1] = node->keys[i];
            i--;
        }
        node->keys[i + 1] = key;
        node->n++;
    } else {
        while (i >= 0 && key < node->keys[i]) i--;
        i++;
        if (node->children[i]->n == 2 * T - 1) {
            splitChild(node, i);
            if (key > node->keys[i]) i++;
        }
        insertNonFull(node->children[i], key);
    }
}

static void inorder(BTreeNode* node, std::vector<int>& result) {
    if (!node) return;
    for (int i = 0; i < node->n; i++) {
        if (!node->leaf) inorder(node->children[i], result);
        result.push_back(node->keys[i]);
    }
    if (!node->leaf) inorder(node->children[node->n], result);
}

std::vector<int> b_tree(std::vector<int> arr) {
    if (arr.empty()) return {};
    BTreeNode* root = new BTreeNode();
    for (int val : arr) {
        if (root->n == 2 * T - 1) {
            BTreeNode* newRoot = new BTreeNode();
            newRoot->leaf = false;
            newRoot->children[0] = root;
            splitChild(newRoot, 0);
            root = newRoot;
        }
        insertNonFull(root, val);
    }
    std::vector<int> result;
    inorder(root, result);
    delete root;
    return result;
}
