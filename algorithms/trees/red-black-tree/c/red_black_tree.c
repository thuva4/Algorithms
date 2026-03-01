#include "red_black_tree.h"
#include <stdlib.h>

#define RB_RED 1
#define RB_BLACK 0

typedef struct RBNode {
    int key;
    struct RBNode* left;
    struct RBNode* right;
    struct RBNode* parent;
    int color;
} RBNode;

static RBNode* root_g;

static RBNode* create_node(int key) {
    RBNode* node = (RBNode*)malloc(sizeof(RBNode));
    node->key = key;
    node->left = NULL;
    node->right = NULL;
    node->parent = NULL;
    node->color = RB_RED;
    return node;
}

static void rotate_left(RBNode* x) {
    RBNode* y = x->right;
    x->right = y->left;
    if (y->left) y->left->parent = x;
    y->parent = x->parent;
    if (!x->parent) root_g = y;
    else if (x == x->parent->left) x->parent->left = y;
    else x->parent->right = y;
    y->left = x;
    x->parent = y;
}

static void rotate_right(RBNode* x) {
    RBNode* y = x->left;
    x->left = y->right;
    if (y->right) y->right->parent = x;
    y->parent = x->parent;
    if (!x->parent) root_g = y;
    else if (x == x->parent->right) x->parent->right = y;
    else x->parent->left = y;
    y->right = x;
    x->parent = y;
}

static void fix_insert(RBNode* z) {
    while (z->parent && z->parent->color == RB_RED) {
        RBNode* gp = z->parent->parent;
        if (z->parent == gp->left) {
            RBNode* y = gp->right;
            if (y && y->color == RB_RED) {
                z->parent->color = RB_BLACK;
                y->color = RB_BLACK;
                gp->color = RB_RED;
                z = gp;
            } else {
                if (z == z->parent->right) {
                    z = z->parent;
                    rotate_left(z);
                }
                z->parent->color = RB_BLACK;
                z->parent->parent->color = RB_RED;
                rotate_right(z->parent->parent);
            }
        } else {
            RBNode* y = gp->left;
            if (y && y->color == RB_RED) {
                z->parent->color = RB_BLACK;
                y->color = RB_BLACK;
                gp->color = RB_RED;
                z = gp;
            } else {
                if (z == z->parent->left) {
                    z = z->parent;
                    rotate_right(z);
                }
                z->parent->color = RB_BLACK;
                z->parent->parent->color = RB_RED;
                rotate_left(z->parent->parent);
            }
        }
    }
    root_g->color = RB_BLACK;
}

static void insert_key(int key) {
    RBNode* y = NULL;
    RBNode* x = root_g;
    while (x) {
        y = x;
        if (key < x->key) x = x->left;
        else if (key > x->key) x = x->right;
        else return;
    }
    RBNode* node = create_node(key);
    node->parent = y;
    if (!y) root_g = node;
    else if (key < y->key) y->left = node;
    else y->right = node;
    fix_insert(node);
}

static void inorder(RBNode* node, int* result, int* idx) {
    if (!node) return;
    inorder(node->left, result, idx);
    result[(*idx)++] = node->key;
    inorder(node->right, result, idx);
}

static void free_tree(RBNode* node) {
    if (!node) return;
    free_tree(node->left);
    free_tree(node->right);
    free(node);
}

void rb_insert_inorder(const int* arr, int n, int* result, int* result_size) {
    root_g = NULL;
    for (int i = 0; i < n; i++) insert_key(arr[i]);
    *result_size = 0;
    inorder(root_g, result, result_size);
    free_tree(root_g);
    root_g = NULL;
}
