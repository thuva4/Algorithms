#ifndef MERGE_SORT_TREE_H
#define MERGE_SORT_TREE_H

typedef struct {
    int** tree;
    int* sizes;
    int n;
} MergeSortTree;

MergeSortTree* mst_build(const int* arr, int n);
int mst_count_leq(const MergeSortTree* mst, int l, int r, int k);
void mst_free(MergeSortTree* mst);

#endif
