#include <vector>

enum Color { RED, BLACK };

struct RBNode {
    int key;
    RBNode* left;
    RBNode* right;
    RBNode* parent;
    Color color;
    RBNode(int k) : key(k), left(nullptr), right(nullptr), parent(nullptr), color(RED) {}
};

static RBNode* root_ptr;

static void rotateLeft(RBNode* x) {
    RBNode* y = x->right;
    x->right = y->left;
    if (y->left) y->left->parent = x;
    y->parent = x->parent;
    if (!x->parent) root_ptr = y;
    else if (x == x->parent->left) x->parent->left = y;
    else x->parent->right = y;
    y->left = x;
    x->parent = y;
}

static void rotateRight(RBNode* x) {
    RBNode* y = x->left;
    x->left = y->right;
    if (y->right) y->right->parent = x;
    y->parent = x->parent;
    if (!x->parent) root_ptr = y;
    else if (x == x->parent->right) x->parent->right = y;
    else x->parent->left = y;
    y->right = x;
    x->parent = y;
}

static void fixInsert(RBNode* z) {
    while (z->parent && z->parent->color == RED) {
        RBNode* gp = z->parent->parent;
        if (z->parent == gp->left) {
            RBNode* y = gp->right;
            if (y && y->color == RED) {
                z->parent->color = BLACK;
                y->color = BLACK;
                gp->color = RED;
                z = gp;
            } else {
                if (z == z->parent->right) {
                    z = z->parent;
                    rotateLeft(z);
                }
                z->parent->color = BLACK;
                z->parent->parent->color = RED;
                rotateRight(z->parent->parent);
            }
        } else {
            RBNode* y = gp->left;
            if (y && y->color == RED) {
                z->parent->color = BLACK;
                y->color = BLACK;
                gp->color = RED;
                z = gp;
            } else {
                if (z == z->parent->left) {
                    z = z->parent;
                    rotateRight(z);
                }
                z->parent->color = BLACK;
                z->parent->parent->color = RED;
                rotateLeft(z->parent->parent);
            }
        }
    }
    root_ptr->color = BLACK;
}

static void insertNode(int key) {
    RBNode* y = nullptr;
    RBNode* x = root_ptr;
    while (x) {
        y = x;
        if (key < x->key) x = x->left;
        else if (key > x->key) x = x->right;
        else return;
    }
    RBNode* node = new RBNode(key);
    node->parent = y;
    if (!y) root_ptr = node;
    else if (key < y->key) y->left = node;
    else y->right = node;
    fixInsert(node);
}

static void inorder(RBNode* node, std::vector<int>& result) {
    if (!node) return;
    inorder(node->left, result);
    result.push_back(node->key);
    inorder(node->right, result);
}

static void freeTree(RBNode* node) {
    if (!node) return;
    freeTree(node->left);
    freeTree(node->right);
    delete node;
}

std::vector<int> rb_insert_inorder(std::vector<int> arr) {
    root_ptr = nullptr;
    for (int val : arr) insertNode(val);
    std::vector<int> result;
    inorder(root_ptr, result);
    freeTree(root_ptr);
    root_ptr = nullptr;
    return result;
}
