#ifndef SPARSE_TABLE_H
#define SPARSE_TABLE_H

typedef struct {
    int** table;
    int* lg;
    int n;
    int k;
} SparseTable;

SparseTable* sparse_table_build(const int* arr, int n);
int sparse_table_query(const SparseTable* st, int l, int r);
void sparse_table_free(SparseTable* st);

#endif
