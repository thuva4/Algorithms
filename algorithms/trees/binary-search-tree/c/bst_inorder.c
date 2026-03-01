#include "bst_inorder.h"
#include <stdlib.h>

typedef struct Node {
    int key;
    struct Node *left;
    struct Node *right;
} Node;

static Node *create_node(int key) {
    Node *node = (Node *)malloc(sizeof(Node));
    node->key = key;
    node->left = NULL;
    node->right = NULL;
    return node;
}

static Node *insert(Node *root, int key) {
    if (root == NULL) {
        return create_node(key);
    }
    if (key <= root->key) {
        root->left = insert(root->left, key);
    } else {
        root->right = insert(root->right, key);
    }
    return root;
}

static void inorder(Node *root, int *result, int *index) {
    if (root == NULL) {
        return;
    }
    inorder(root->left, result, index);
    result[(*index)++] = root->key;
    inorder(root->right, result, index);
}

static void free_tree(Node *root) {
    if (root == NULL) return;
    free_tree(root->left);
    free_tree(root->right);
    free(root);
}

int *bst_inorder(int arr[], int size, int *out_size) {
    *out_size = size;
    if (size == 0) {
        return NULL;
    }

    Node *root = NULL;
    for (int i = 0; i < size; i++) {
        root = insert(root, arr[i]);
    }

    int *result = (int *)malloc(size * sizeof(int));
    int index = 0;
    inorder(root, result, &index);
    free_tree(root);
    return result;
}
