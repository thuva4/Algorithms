#ifndef SEGMENT_TREE_LAZY_H
#define SEGMENT_TREE_LAZY_H

typedef struct {
    long long* tree;
    long long* lazy;
    int n;
} SegTreeLazy;

SegTreeLazy* seg_lazy_build(const int* arr, int n);
void seg_lazy_update(SegTreeLazy* st, int l, int r, long long val);
long long seg_lazy_query(SegTreeLazy* st, int l, int r);
void seg_lazy_free(SegTreeLazy* st);

#endif
