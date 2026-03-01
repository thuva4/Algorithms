#include "b_tree.h"
#include <stdlib.h>
#include <stdbool.h>

#define T 3
#define MAX_KEYS (2 * T - 1)
#define MAX_CHILDREN (2 * T)

typedef struct BTreeNode {
    int keys[MAX_KEYS];
    struct BTreeNode* children[MAX_CHILDREN];
    int n;
    bool leaf;
} BTreeNode;

static BTreeNode* create_node(bool leaf) {
    BTreeNode* node = (BTreeNode*)calloc(1, sizeof(BTreeNode));
    node->leaf = leaf;
    node->n = 0;
    return node;
}

static void split_child(BTreeNode* parent, int i) {
    BTreeNode* full = parent->children[i];
    BTreeNode* new_node = create_node(full->leaf);
    new_node->n = T - 1;
    for (int j = 0; j < T - 1; j++) {
        new_node->keys[j] = full->keys[j + T];
    }
    if (!full->leaf) {
        for (int j = 0; j < T; j++) {
            new_node->children[j] = full->children[j + T];
            full->children[j + T] = NULL;
        }
    }
    for (int j = parent->n; j > i; j--) {
        parent->children[j + 1] = parent->children[j];
    }
    parent->children[i + 1] = new_node;
    for (int j = parent->n - 1; j >= i; j--) {
        parent->keys[j + 1] = parent->keys[j];
    }
    parent->keys[i] = full->keys[T - 1];
    full->n = T - 1;
    parent->n++;
}

static void insert_non_full(BTreeNode* node, int key) {
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
        if (node->children[i]->n == MAX_KEYS) {
            split_child(node, i);
            if (key > node->keys[i]) i++;
        }
        insert_non_full(node->children[i], key);
    }
}

static void inorder(BTreeNode* node, int* result, int* idx) {
    if (!node) return;
    for (int i = 0; i < node->n; i++) {
        if (!node->leaf) inorder(node->children[i], result, idx);
        result[(*idx)++] = node->keys[i];
    }
    if (!node->leaf) inorder(node->children[node->n], result, idx);
}

static void free_tree(BTreeNode* node) {
    if (!node) return;
    if (!node->leaf) {
        for (int i = 0; i <= node->n; i++) {
            free_tree(node->children[i]);
        }
    }
    free(node);
}

int* b_tree(int* arr, int n, int* out_size) {
    if (n == 0) {
        *out_size = 0;
        return NULL;
    }
    BTreeNode* root = create_node(true);
    for (int i = 0; i < n; i++) {
        if (root->n == MAX_KEYS) {
            BTreeNode* new_root = create_node(false);
            new_root->children[0] = root;
            split_child(new_root, 0);
            root = new_root;
        }
        insert_non_full(root, arr[i]);
    }
    int* result = (int*)malloc(n * sizeof(int));
    int idx = 0;
    inorder(root, result, &idx);
    *out_size = idx;
    free_tree(root);
    return result;
}
