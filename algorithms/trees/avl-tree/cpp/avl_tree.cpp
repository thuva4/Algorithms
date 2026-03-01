#include <vector>
#include <algorithm>

struct AvlNode {
    int key;
    AvlNode* left;
    AvlNode* right;
    int height;
    AvlNode(int k) : key(k), left(nullptr), right(nullptr), height(1) {}
};

static int height(AvlNode* node) {
    return node ? node->height : 0;
}

static void updateHeight(AvlNode* node) {
    node->height = 1 + std::max(height(node->left), height(node->right));
}

static int balanceFactor(AvlNode* node) {
    return node ? height(node->left) - height(node->right) : 0;
}

static AvlNode* rotateRight(AvlNode* y) {
    AvlNode* x = y->left;
    AvlNode* t2 = x->right;
    x->right = y;
    y->left = t2;
    updateHeight(y);
    updateHeight(x);
    return x;
}

static AvlNode* rotateLeft(AvlNode* x) {
    AvlNode* y = x->right;
    AvlNode* t2 = y->left;
    y->left = x;
    x->right = t2;
    updateHeight(x);
    updateHeight(y);
    return y;
}

static AvlNode* insert(AvlNode* node, int key) {
    if (!node) return new AvlNode(key);
    if (key < node->key) node->left = insert(node->left, key);
    else if (key > node->key) node->right = insert(node->right, key);
    else return node;

    updateHeight(node);
    int bf = balanceFactor(node);

    if (bf > 1 && key < node->left->key) return rotateRight(node);
    if (bf < -1 && key > node->right->key) return rotateLeft(node);
    if (bf > 1 && key > node->left->key) {
        node->left = rotateLeft(node->left);
        return rotateRight(node);
    }
    if (bf < -1 && key < node->right->key) {
        node->right = rotateRight(node->right);
        return rotateLeft(node);
    }

    return node;
}

static void inorder(AvlNode* node, std::vector<int>& result) {
    if (!node) return;
    inorder(node->left, result);
    result.push_back(node->key);
    inorder(node->right, result);
}

static void freeTree(AvlNode* node) {
    if (!node) return;
    freeTree(node->left);
    freeTree(node->right);
    delete node;
}

std::vector<int> avl_insert_inorder(std::vector<int> arr) {
    AvlNode* root = nullptr;
    for (int val : arr) {
        root = insert(root, val);
    }
    std::vector<int> result;
    inorder(root, result);
    freeTree(root);
    return result;
}
