#include "avl_tree.h"
#include <stdlib.h>

typedef struct AvlNode {
    int key;
    struct AvlNode* left;
    struct AvlNode* right;
    int height;
} AvlNode;

static AvlNode* create_node(int key) {
    AvlNode* node = (AvlNode*)malloc(sizeof(AvlNode));
    node->key = key;
    node->left = NULL;
    node->right = NULL;
    node->height = 1;
    return node;
}

static int height(AvlNode* node) {
    return node ? node->height : 0;
}

static int max_int(int a, int b) {
    return a > b ? a : b;
}

static void update_height(AvlNode* node) {
    node->height = 1 + max_int(height(node->left), height(node->right));
}

static int balance_factor(AvlNode* node) {
    return node ? height(node->left) - height(node->right) : 0;
}

static AvlNode* rotate_right(AvlNode* y) {
    AvlNode* x = y->left;
    AvlNode* t2 = x->right;
    x->right = y;
    y->left = t2;
    update_height(y);
    update_height(x);
    return x;
}

static AvlNode* rotate_left(AvlNode* x) {
    AvlNode* y = x->right;
    AvlNode* t2 = y->left;
    y->left = x;
    x->right = t2;
    update_height(x);
    update_height(y);
    return y;
}

static AvlNode* insert(AvlNode* node, int key) {
    if (!node) return create_node(key);
    if (key < node->key) node->left = insert(node->left, key);
    else if (key > node->key) node->right = insert(node->right, key);
    else return node;

    update_height(node);
    int bf = balance_factor(node);

    if (bf > 1 && key < node->left->key) return rotate_right(node);
    if (bf < -1 && key > node->right->key) return rotate_left(node);
    if (bf > 1 && key > node->left->key) {
        node->left = rotate_left(node->left);
        return rotate_right(node);
    }
    if (bf < -1 && key < node->right->key) {
        node->right = rotate_right(node->right);
        return rotate_left(node);
    }

    return node;
}

static void inorder(AvlNode* node, int* result, int* idx) {
    if (!node) return;
    inorder(node->left, result, idx);
    result[(*idx)++] = node->key;
    inorder(node->right, result, idx);
}

static void free_tree(AvlNode* node) {
    if (!node) return;
    free_tree(node->left);
    free_tree(node->right);
    free(node);
}

void avl_insert_inorder(const int* arr, int n, int* result, int* result_size) {
    AvlNode* root = NULL;
    for (int i = 0; i < n; i++) {
        root = insert(root, arr[i]);
    }
    *result_size = 0;
    inorder(root, result, result_size);
    free_tree(root);
}
