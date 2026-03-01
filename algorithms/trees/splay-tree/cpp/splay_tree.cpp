#include <vector>

struct SNode {
    int key;
    SNode *left, *right;
    SNode(int k) : key(k), left(nullptr), right(nullptr) {}
};

static SNode* rightRotate(SNode* x) {
    SNode* y = x->left;
    x->left = y->right;
    y->right = x;
    return y;
}

static SNode* leftRotate(SNode* x) {
    SNode* y = x->right;
    x->right = y->left;
    y->left = x;
    return y;
}

static SNode* splay(SNode* root, int key) {
    if (!root || root->key == key) return root;
    if (key < root->key) {
        if (!root->left) return root;
        if (key < root->left->key) {
            root->left->left = splay(root->left->left, key);
            root = rightRotate(root);
        } else if (key > root->left->key) {
            root->left->right = splay(root->left->right, key);
            if (root->left->right) root->left = leftRotate(root->left);
        }
        return root->left ? rightRotate(root) : root;
    } else {
        if (!root->right) return root;
        if (key > root->right->key) {
            root->right->right = splay(root->right->right, key);
            root = leftRotate(root);
        } else if (key < root->right->key) {
            root->right->left = splay(root->right->left, key);
            if (root->right->left) root->right = rightRotate(root->right);
        }
        return root->right ? leftRotate(root) : root;
    }
}

static SNode* insert(SNode* root, int key) {
    if (!root) return new SNode(key);
    root = splay(root, key);
    if (root->key == key) return root;
    SNode* node = new SNode(key);
    if (key < root->key) {
        node->right = root;
        node->left = root->left;
        root->left = nullptr;
    } else {
        node->left = root;
        node->right = root->right;
        root->right = nullptr;
    }
    return node;
}

static void inorder(SNode* node, std::vector<int>& result) {
    if (!node) return;
    inorder(node->left, result);
    result.push_back(node->key);
    inorder(node->right, result);
}

static void freeTree(SNode* node) {
    if (!node) return;
    freeTree(node->left);
    freeTree(node->right);
    delete node;
}

std::vector<int> splay_tree(std::vector<int> arr) {
    SNode* root = nullptr;
    for (int val : arr) root = insert(root, val);
    std::vector<int> result;
    inorder(root, result);
    freeTree(root);
    return result;
}
