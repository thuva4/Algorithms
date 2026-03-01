#include "tree_sort.h"
#include <vector>

struct Node {
    int key;
    Node *left, *right;
    
    Node(int item) : key(item), left(nullptr), right(nullptr) {}
};

static Node* insert(Node* node, int key) {
    if (node == nullptr) return new Node(key);

    if (key < node->key)
        node->left = insert(node->left, key);
    else
        node->right = insert(node->right, key);

    return node;
}

static void storeSorted(Node* root, std::vector<int>& arr, int& i) {
    if (root != nullptr) {
        storeSorted(root->left, arr, i);
        arr[i++] = root->key;
        storeSorted(root->right, arr, i);
    }
}

static void freeTree(Node* root) {
    if (root != nullptr) {
        freeTree(root->left);
        freeTree(root->right);
        delete root;
    }
}

void tree_sort(std::vector<int>& arr) {
    Node* root = nullptr;
    
    for (int x : arr)
        root = insert(root, x);
        
    int i = 0;
    storeSorted(root, arr, i);
    
    freeTree(root);
}
