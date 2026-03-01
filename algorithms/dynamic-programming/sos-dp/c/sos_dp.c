#include <stdio.h>
#include <string.h>
#include "sos_dp.h"

void sos_dp(int n, int* f, int* sos) {
    int size = 1 << n;
    memcpy(sos, f, size * sizeof(int));

    for (int i = 0; i < n; i++) {
        for (int mask = 0; mask < size; mask++) {
            if (mask & (1 << i)) {
                sos[mask] += sos[mask ^ (1 << i)];
            }
        }
    }
}

int main(void) {
    int n;
    scanf("%d", &n);
    int size = 1 << n;
    int f[1 << 20];
    int result[1 << 20];
    for (int i = 0; i < size; i++) scanf("%d", &f[i]);
    sos_dp(n, f, result);
    for (int i = 0; i < size; i++) {
        if (i > 0) printf(" ");
        printf("%d", result[i]);
    }
    printf("\n");
    return 0;
}
