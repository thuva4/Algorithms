#ifndef PERSISTENT_SEGMENT_TREE_H
#define PERSISTENT_SEGMENT_TREE_H

int pst_build(const int* arr, int n);
int pst_update(int root, int n, int idx, int val);
long long pst_query(int root, int n, int l, int r);

#endif
