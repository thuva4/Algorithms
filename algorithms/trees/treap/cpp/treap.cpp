#include <vector>
#include <cstdlib>

struct TreapNode {
    int key, priority;
    TreapNode *left, *right;
    TreapNode(int k) : key(k), priority(rand()), left(nullptr), right(nullptr) {}
};

static TreapNode* rightRotate(TreapNode* p) {
    TreapNode* q = p->left;
    p->left = q->right;
    q->right = p;
    return q;
}

static TreapNode* leftRotate(TreapNode* p) {
    TreapNode* q = p->right;
    p->right = q->left;
    q->left = p;
    return q;
}

static TreapNode* insert(TreapNode* root, int key) {
    if (!root) return new TreapNode(key);
    if (key < root->key) {
        root->left = insert(root->left, key);
        if (root->left->priority > root->priority) root = rightRotate(root);
    } else if (key > root->key) {
        root->right = insert(root->right, key);
        if (root->right->priority > root->priority) root = leftRotate(root);
    }
    return root;
}

static void inorder(TreapNode* node, std::vector<int>& result) {
    if (!node) return;
    inorder(node->left, result);
    result.push_back(node->key);
    inorder(node->right, result);
}

static void freeTree(TreapNode* node) {
    if (!node) return;
    freeTree(node->left);
    freeTree(node->right);
    delete node;
}

std::vector<int> treap(std::vector<int> arr) {
    TreapNode* root = nullptr;
    for (int val : arr) root = insert(root, val);
    std::vector<int> result;
    inorder(root, result);
    freeTree(root);
    return result;
}
