#include "strassens_matrix.h"
#include <stdlib.h>
#include <string.h>

static int* mat_alloc(int n) { return (int*)calloc(n * n, sizeof(int)); }

static void mat_add(int* a, int* b, int* r, int n) {
    for (int i = 0; i < n*n; i++) r[i] = a[i] + b[i];
}

static void mat_sub(int* a, int* b, int* r, int n) {
    for (int i = 0; i < n*n; i++) r[i] = a[i] - b[i];
}

static void get_sub(int* m, int n, int r0, int c0, int* out, int h) {
    for (int i = 0; i < h; i++)
        for (int j = 0; j < h; j++)
            out[i*h+j] = m[(r0+i)*n+c0+j];
}

static void mat_multiply(int* a, int* b, int* c, int n) {
    if (n == 1) { c[0] = a[0] * b[0]; return; }
    int h = n / 2;
    int h2 = h * h;

    int *a11=mat_alloc(h),*a12=mat_alloc(h),*a21=mat_alloc(h),*a22=mat_alloc(h);
    int *b11=mat_alloc(h),*b12=mat_alloc(h),*b21=mat_alloc(h),*b22=mat_alloc(h);
    get_sub(a,n,0,0,a11,h); get_sub(a,n,0,h,a12,h);
    get_sub(a,n,h,0,a21,h); get_sub(a,n,h,h,a22,h);
    get_sub(b,n,0,0,b11,h); get_sub(b,n,0,h,b12,h);
    get_sub(b,n,h,0,b21,h); get_sub(b,n,h,h,b22,h);

    int *t1=mat_alloc(h),*t2=mat_alloc(h);
    int *m1=mat_alloc(h),*m2=mat_alloc(h),*m3=mat_alloc(h),*m4=mat_alloc(h);
    int *m5=mat_alloc(h),*m6=mat_alloc(h),*m7=mat_alloc(h);

    mat_add(a11,a22,t1,h); mat_add(b11,b22,t2,h); mat_multiply(t1,t2,m1,h);
    mat_add(a21,a22,t1,h); mat_multiply(t1,b11,m2,h);
    mat_sub(b12,b22,t1,h); mat_multiply(a11,t1,m3,h);
    mat_sub(b21,b11,t1,h); mat_multiply(a22,t1,m4,h);
    mat_add(a11,a12,t1,h); mat_multiply(t1,b22,m5,h);
    mat_sub(a21,a11,t1,h); mat_add(b11,b12,t2,h); mat_multiply(t1,t2,m6,h);
    mat_sub(a12,a22,t1,h); mat_add(b21,b22,t2,h); mat_multiply(t1,t2,m7,h);

    for (int i = 0; i < h; i++)
        for (int j = 0; j < h; j++) {
            int idx = i*h+j;
            c[i*n+j] = m1[idx]+m4[idx]-m5[idx]+m7[idx];
            c[i*n+h+j] = m3[idx]+m5[idx];
            c[(h+i)*n+j] = m2[idx]+m4[idx];
            c[(h+i)*n+h+j] = m1[idx]+m3[idx]-m2[idx]+m6[idx];
        }

    free(a11);free(a12);free(a21);free(a22);
    free(b11);free(b12);free(b21);free(b22);
    free(t1);free(t2);
    free(m1);free(m2);free(m3);free(m4);free(m5);free(m6);free(m7);
}

int* strassens_matrix(int* arr, int len, int* out_len) {
    int n = arr[0];
    int sz = 1;
    while (sz < n) sz *= 2;

    int* a = mat_alloc(sz);
    int* b = mat_alloc(sz);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) {
            a[i*sz+j] = arr[1+i*n+j];
            b[i*sz+j] = arr[1+n*n+i*n+j];
        }

    int* c = mat_alloc(sz);
    mat_multiply(a, b, c, sz);

    *out_len = n * n;
    int* out = (int*)malloc(n * n * sizeof(int));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            out[i*n+j] = c[i*sz+j];

    free(a); free(b); free(c);
    return out;
}
