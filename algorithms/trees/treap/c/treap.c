#include "treap.h"
#include <stdlib.h>

typedef struct TNode {
    int key, priority;
    struct TNode *left, *right;
} TNode;

static TNode* create_tnode(int key) {
    TNode* n = (TNode*)malloc(sizeof(TNode));
    n->key = key;
    n->priority = rand();
    n->left = n->right = NULL;
    return n;
}

static TNode* right_rotate(TNode* p) {
    TNode* q = p->left;
    p->left = q->right;
    q->right = p;
    return q;
}

static TNode* left_rotate(TNode* p) {
    TNode* q = p->right;
    p->right = q->left;
    q->left = p;
    return q;
}

static TNode* insert_node(TNode* root, int key) {
    if (!root) return create_tnode(key);
    if (key < root->key) {
        root->left = insert_node(root->left, key);
        if (root->left->priority > root->priority) root = right_rotate(root);
    } else if (key > root->key) {
        root->right = insert_node(root->right, key);
        if (root->right->priority > root->priority) root = left_rotate(root);
    }
    return root;
}

static void inorder_collect(TNode* node, int* result, int* idx) {
    if (!node) return;
    inorder_collect(node->left, result, idx);
    result[(*idx)++] = node->key;
    inorder_collect(node->right, result, idx);
}

static void free_tree(TNode* node) {
    if (!node) return;
    free_tree(node->left);
    free_tree(node->right);
    free(node);
}

int* treap(int* arr, int n, int* out_size) {
    TNode* root = NULL;
    for (int i = 0; i < n; i++) root = insert_node(root, arr[i]);
    int* result = (int*)malloc(n * sizeof(int));
    int idx = 0;
    inorder_collect(root, result, &idx);
    *out_size = idx;
    free_tree(root);
    return result;
}
