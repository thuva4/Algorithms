#include "skip_list.h"
#include <stdlib.h>
#include <limits.h>

#define MAX_LVL 16

typedef struct SkipNode {
    int key;
    struct SkipNode* forward[MAX_LVL + 1];
} SkipNode;

static SkipNode* create_skip_node(int key, int level) {
    SkipNode* n = (SkipNode*)calloc(1, sizeof(SkipNode));
    n->key = key;
    return n;
}

int* skip_list(int* arr, int n, int* out_size) {
    SkipNode* header = create_skip_node(INT_MIN, MAX_LVL);
    int level = 0;

    for (int idx = 0; idx < n; idx++) {
        int val = arr[idx];
        SkipNode* update[MAX_LVL + 1];
        SkipNode* current = header;
        for (int i = level; i >= 0; i--) {
            while (current->forward[i] && current->forward[i]->key < val)
                current = current->forward[i];
            update[i] = current;
        }
        current = current->forward[0];
        if (current && current->key == val) continue;

        int newLevel = 0;
        while (rand() % 2 && newLevel < MAX_LVL) newLevel++;
        if (newLevel > level) {
            for (int i = level + 1; i <= newLevel; i++) update[i] = header;
            level = newLevel;
        }
        SkipNode* newNode = create_skip_node(val, newLevel);
        for (int i = 0; i <= newLevel; i++) {
            newNode->forward[i] = update[i]->forward[i];
            update[i]->forward[i] = newNode;
        }
    }

    // Count nodes
    int count = 0;
    SkipNode* node = header->forward[0];
    while (node) { count++; node = node->forward[0]; }

    int* result = (int*)malloc(count * sizeof(int));
    *out_size = count;
    node = header->forward[0];
    int i = 0;
    while (node) { result[i++] = node->key; node = node->forward[0]; }

    // Cleanup
    node = header;
    while (node) {
        SkipNode* next = node->forward[0];
        free(node);
        node = next;
    }
    return result;
}
