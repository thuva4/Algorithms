#include "splay_tree.h"
#include <stdlib.h>

typedef struct SNode {
    int key;
    struct SNode *left, *right;
} SNode;

static SNode* create_node(int key) {
    SNode* n = (SNode*)malloc(sizeof(SNode));
    n->key = key;
    n->left = n->right = NULL;
    return n;
}

static SNode* right_rotate(SNode* x) {
    SNode* y = x->left;
    x->left = y->right;
    y->right = x;
    return y;
}

static SNode* left_rotate(SNode* x) {
    SNode* y = x->right;
    x->right = y->left;
    y->left = x;
    return y;
}

static SNode* splay_op(SNode* root, int key) {
    if (!root || root->key == key) return root;
    if (key < root->key) {
        if (!root->left) return root;
        if (key < root->left->key) {
            root->left->left = splay_op(root->left->left, key);
            root = right_rotate(root);
        } else if (key > root->left->key) {
            root->left->right = splay_op(root->left->right, key);
            if (root->left->right) root->left = left_rotate(root->left);
        }
        return root->left ? right_rotate(root) : root;
    } else {
        if (!root->right) return root;
        if (key > root->right->key) {
            root->right->right = splay_op(root->right->right, key);
            root = left_rotate(root);
        } else if (key < root->right->key) {
            root->right->left = splay_op(root->right->left, key);
            if (root->right->left) root->right = right_rotate(root->right);
        }
        return root->right ? left_rotate(root) : root;
    }
}

static SNode* insert_node(SNode* root, int key) {
    if (!root) return create_node(key);
    root = splay_op(root, key);
    if (root->key == key) return root;
    SNode* node = create_node(key);
    if (key < root->key) {
        node->right = root;
        node->left = root->left;
        root->left = NULL;
    } else {
        node->left = root;
        node->right = root->right;
        root->right = NULL;
    }
    return node;
}

static void inorder(SNode* node, int* result, int* idx) {
    if (!node) return;
    inorder(node->left, result, idx);
    result[(*idx)++] = node->key;
    inorder(node->right, result, idx);
}

static void free_tree(SNode* node) {
    if (!node) return;
    free_tree(node->left);
    free_tree(node->right);
    free(node);
}

int* splay_tree(int* arr, int n, int* out_size) {
    SNode* root = NULL;
    for (int i = 0; i < n; i++) root = insert_node(root, arr[i]);
    int* result = (int*)malloc(n * sizeof(int));
    int idx = 0;
    inorder(root, result, &idx);
    *out_size = idx;
    free_tree(root);
    return result;
}
