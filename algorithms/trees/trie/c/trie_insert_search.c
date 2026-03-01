#include "trie_insert_search.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

#define MAX_CHILDREN 12

typedef struct TrieNode {
    struct TrieNode *children[MAX_CHILDREN];
    bool is_end;
} TrieNode;

static TrieNode *create_node(void) {
    TrieNode *node = (TrieNode *)calloc(1, sizeof(TrieNode));
    node->is_end = false;
    return node;
}

static void free_trie(TrieNode *node) {
    if (node == NULL) return;
    for (int i = 0; i < MAX_CHILDREN; i++) {
        free_trie(node->children[i]);
    }
    free(node);
}

static void trie_insert(TrieNode *root, int key) {
    char buf[20];
    snprintf(buf, sizeof(buf), "%d", key);
    TrieNode *node = root;
    for (int i = 0; buf[i] != '\0'; i++) {
        int idx = buf[i] - '0';
        if (buf[i] == '-') idx = 10;
        if (idx < 0 || idx >= MAX_CHILDREN) idx = 11;
        if (node->children[idx] == NULL) {
            node->children[idx] = create_node();
        }
        node = node->children[idx];
    }
    node->is_end = true;
}

static bool trie_search(TrieNode *root, int key) {
    char buf[20];
    snprintf(buf, sizeof(buf), "%d", key);
    TrieNode *node = root;
    for (int i = 0; buf[i] != '\0'; i++) {
        int idx = buf[i] - '0';
        if (buf[i] == '-') idx = 10;
        if (idx < 0 || idx >= MAX_CHILDREN) idx = 11;
        if (node->children[idx] == NULL) {
            return false;
        }
        node = node->children[idx];
    }
    return node->is_end;
}

int trie_insert_search(int arr[], int size) {
    int mid = size / 2;
    TrieNode *root = create_node();

    for (int i = 0; i < mid; i++) {
        trie_insert(root, arr[i]);
    }

    int count = 0;
    for (int i = mid; i < size; i++) {
        if (trie_search(root, arr[i])) {
            count++;
        }
    }

    free_trie(root);
    return count;
}
