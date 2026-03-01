#ifndef FIBONACCI_HEAP_H
#define FIBONACCI_HEAP_H

typedef struct FibNode {
    int key;
    int degree;
    struct FibNode *parent, *child, *left, *right;
    int mark;
} FibNode;

typedef struct {
    FibNode *min_node;
    int n;
} FibHeap;

void fib_heap_init(FibHeap *heap);
void fib_heap_insert(FibHeap *heap, int key);
int fib_heap_extract_min(FibHeap *heap);
void fibonacci_heap(const int *operations, int ops_len, int *results, int *res_len);

#endif
