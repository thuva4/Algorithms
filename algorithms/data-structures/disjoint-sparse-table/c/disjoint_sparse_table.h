#ifndef DISJOINT_SPARSE_TABLE_H
#define DISJOINT_SPARSE_TABLE_H

typedef struct {
    long long** table;
    long long* a;
    int sz;
    int levels;
} DisjointSparseTable;

DisjointSparseTable* dst_build(const int* arr, int n);
long long dst_query(const DisjointSparseTable* dst, int l, int r);
void dst_free(DisjointSparseTable* dst);

#endif
