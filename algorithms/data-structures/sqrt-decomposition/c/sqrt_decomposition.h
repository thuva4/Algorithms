#ifndef SQRT_DECOMPOSITION_H
#define SQRT_DECOMPOSITION_H

typedef struct {
    int* a;
    long long* blocks;
    int n;
    int block_sz;
} SqrtDecomp;

SqrtDecomp* sqrt_decomp_build(const int* arr, int n);
long long sqrt_decomp_query(const SqrtDecomp* sd, int l, int r);
void sqrt_decomp_free(SqrtDecomp* sd);

#endif
