#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "fibonacci_heap.h"

static FibNode *create_node(int key) {
    FibNode *n = (FibNode *)malloc(sizeof(FibNode));
    n->key = key;
    n->degree = 0;
    n->parent = n->child = NULL;
    n->left = n->right = n;
    n->mark = 0;
    return n;
}

static void add_to_root_list(FibHeap *heap, FibNode *node) {
    node->left = heap->min_node;
    node->right = heap->min_node->right;
    heap->min_node->right->left = node;
    heap->min_node->right = node;
}

static void remove_from_list(FibNode *node) {
    node->left->right = node->right;
    node->right->left = node->left;
}

static void link(FibHeap *heap, FibNode *y, FibNode *x) {
    remove_from_list(y);
    y->left = y;
    y->right = y;
    if (x->child == NULL) {
        x->child = y;
    } else {
        y->left = x->child;
        y->right = x->child->right;
        x->child->right->left = y;
        x->child->right = y;
    }
    y->parent = x;
    x->degree++;
    y->mark = 0;
}

static void consolidate(FibHeap *heap) {
    int max_deg = (int)(log2(heap->n)) + 2;
    FibNode **A = (FibNode **)calloc(max_deg + 1, sizeof(FibNode *));
    int a_size = max_deg + 1;

    /* Collect roots */
    int root_count = 0;
    FibNode *curr = heap->min_node;
    do { root_count++; curr = curr->right; } while (curr != heap->min_node);

    FibNode **roots = (FibNode **)malloc(root_count * sizeof(FibNode *));
    curr = heap->min_node;
    for (int i = 0; i < root_count; i++) {
        roots[i] = curr;
        curr = curr->right;
    }

    for (int i = 0; i < root_count; i++) {
        FibNode *x = roots[i];
        int d = x->degree;
        while (d < a_size && A[d] != NULL) {
            FibNode *y = A[d];
            if (x->key > y->key) { FibNode *t = x; x = y; y = t; }
            link(heap, y, x);
            A[d] = NULL;
            d++;
        }
        if (d >= a_size) {
            A = (FibNode **)realloc(A, (d + 1) * sizeof(FibNode *));
            for (int j = a_size; j <= d; j++) A[j] = NULL;
            a_size = d + 1;
        }
        A[d] = x;
    }

    heap->min_node = NULL;
    for (int i = 0; i < a_size; i++) {
        if (A[i] != NULL) {
            A[i]->left = A[i];
            A[i]->right = A[i];
            if (heap->min_node == NULL) {
                heap->min_node = A[i];
            } else {
                add_to_root_list(heap, A[i]);
                if (A[i]->key < heap->min_node->key)
                    heap->min_node = A[i];
            }
        }
    }
    free(A);
    free(roots);
}

void fib_heap_init(FibHeap *heap) {
    heap->min_node = NULL;
    heap->n = 0;
}

void fib_heap_insert(FibHeap *heap, int key) {
    FibNode *node = create_node(key);
    if (heap->min_node == NULL) {
        heap->min_node = node;
    } else {
        add_to_root_list(heap, node);
        if (node->key < heap->min_node->key)
            heap->min_node = node;
    }
    heap->n++;
}

int fib_heap_extract_min(FibHeap *heap) {
    FibNode *z = heap->min_node;
    if (z == NULL) return -1;

    if (z->child != NULL) {
        FibNode *child = z->child;
        int child_count = 0;
        FibNode *c = child;
        do { child_count++; c = c->right; } while (c != child);

        FibNode **children = (FibNode **)malloc(child_count * sizeof(FibNode *));
        c = child;
        for (int i = 0; i < child_count; i++) {
            children[i] = c;
            c = c->right;
        }
        for (int i = 0; i < child_count; i++) {
            add_to_root_list(heap, children[i]);
            children[i]->parent = NULL;
        }
        free(children);
    }

    remove_from_list(z);
    if (z == z->right) {
        heap->min_node = NULL;
    } else {
        heap->min_node = z->right;
        consolidate(heap);
    }
    heap->n--;
    int result = z->key;
    free(z);
    return result;
}

void fibonacci_heap(const int *operations, int ops_len, int *results, int *res_len) {
    FibHeap heap;
    fib_heap_init(&heap);
    *res_len = 0;
    for (int i = 0; i < ops_len; i++) {
        if (operations[i] == 0) {
            results[(*res_len)++] = fib_heap_extract_min(&heap);
        } else {
            fib_heap_insert(&heap, operations[i]);
        }
    }
}

int main(void) {
    int ops[] = {3, 1, 4, 0, 0};
    int results[5];
    int res_len;
    fibonacci_heap(ops, 5, results, &res_len);
    for (int i = 0; i < res_len; i++) printf("%d ", results[i]);
    printf("\n");
    return 0;
}
