#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "van_emde_boas_tree.h"

/* Simplified vEB using bitset for correctness with small universes */
typedef struct {
    int *present;
    int u;
} SimpleVEB;

static void sveb_init(SimpleVEB *v, int u) {
    v->u = u;
    v->present = (int *)calloc(u, sizeof(int));
}

static void sveb_free(SimpleVEB *v) {
    free(v->present);
}

static void sveb_insert(SimpleVEB *v, int x) {
    if (x >= 0 && x < v->u) v->present[x] = 1;
}

static int sveb_member(SimpleVEB *v, int x) {
    if (x >= 0 && x < v->u) return v->present[x];
    return 0;
}

static int sveb_successor(SimpleVEB *v, int x) {
    for (int i = x + 1; i < v->u; i++) {
        if (v->present[i]) return i;
    }
    return -1;
}

void van_emde_boas_tree(const int *data, int data_len, int *results, int *res_len) {
    int u = data[0];
    int n_ops = data[1];
    SimpleVEB veb;
    sveb_init(&veb, u);
    *res_len = 0;
    int idx = 2;
    for (int i = 0; i < n_ops; i++) {
        int op = data[idx];
        int val = data[idx + 1];
        idx += 2;
        if (op == 1) {
            sveb_insert(&veb, val);
        } else if (op == 2) {
            results[(*res_len)++] = sveb_member(&veb, val);
        } else {
            results[(*res_len)++] = sveb_successor(&veb, val);
        }
    }
    sveb_free(&veb);
}

int main(void) {
    int data[] = {16, 4, 1, 3, 1, 5, 2, 3, 2, 7};
    int results[10];
    int res_len;
    van_emde_boas_tree(data, 10, results, &res_len);
    for (int i = 0; i < res_len; i++) printf("%d ", results[i]);
    printf("\n");
    return 0;
}
