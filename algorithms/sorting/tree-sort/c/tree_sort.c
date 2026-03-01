#include "tree_sort.h"
#include <stdlib.h>

typedef struct Node {
    int key;
    struct Node *left, *right;
} Node;

static Node* newNode(int item) {
    Node* temp = (Node*)malloc(sizeof(Node));
    temp->key = item;
    temp->left = temp->right = NULL;
    return temp;
}

static Node* insert(Node* node, int key) {
    if (node == NULL) return newNode(key);

    if (key < node->key)
        node->left = insert(node->left, key);
    else
        node->right = insert(node->right, key);

    return node;
}

static void storeSorted(Node* root, int arr[], int* i) {
    if (root != NULL) {
        storeSorted(root->left, arr, i);
        arr[(*i)++] = root->key;
        storeSorted(root->right, arr, i);
    }
}

static void freeTree(Node* root) {
    if (root != NULL) {
        freeTree(root->left);
        freeTree(root->right);
        free(root);
    }
}

void tree_sort(int arr[], int n) {
    Node* root = NULL;
    
    // Construct BST
    for (int i = 0; i < n; i++)
        root = insert(root, arr[i]);

    // Store in-order traversal back to array
    int i = 0;
    storeSorted(root, arr, &i);
    
    // Free memory
    freeTree(root);
}
