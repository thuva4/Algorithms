#ifndef BINARY_INDEXED_TREE_2D_H
#define BINARY_INDEXED_TREE_2D_H

typedef struct {
    long long** tree;
    int rows, cols;
} BIT2D;

BIT2D* bit2d_create(int rows, int cols);
void bit2d_update(BIT2D* bit, int r, int c, long long val);
long long bit2d_query(const BIT2D* bit, int r, int c);
void bit2d_free(BIT2D* bit);

#endif
