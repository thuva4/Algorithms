#include <vector>

struct Node {
    int key;
    Node* left;
    Node* right;

    Node(int k) : key(k), left(nullptr), right(nullptr) {}
};

static Node* insert(Node* root, int key) {
    if (root == nullptr) {
        return new Node(key);
    }
    if (key <= root->key) {
        root->left = insert(root->left, key);
    } else {
        root->right = insert(root->right, key);
    }
    return root;
}

static void inorder(Node* root, std::vector<int>& result) {
    if (root == nullptr) {
        return;
    }
    inorder(root->left, result);
    result.push_back(root->key);
    inorder(root->right, result);
}

static void freeTree(Node* root) {
    if (root == nullptr) return;
    freeTree(root->left);
    freeTree(root->right);
    delete root;
}

std::vector<int> bstInorder(std::vector<int> arr) {
    Node* root = nullptr;
    for (int key : arr) {
        root = insert(root, key);
    }

    std::vector<int> result;
    inorder(root, result);
    freeTree(root);
    return result;
}
