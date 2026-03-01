#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "mobius_function.h"

int mobius_function(int n) {
    int *mu = (int *)calloc(n + 1, sizeof(int));
    int *primes = (int *)malloc((n + 1) * sizeof(int));
    char *is_composite = (char *)calloc(n + 1, sizeof(char));
    int prime_count = 0;

    if (!mu || !primes || !is_composite) {
        free(mu);
        free(primes);
        free(is_composite);
        return 0;
    }

    mu[1] = 1;

    for (int i = 2; i <= n; i++) {
        if (!is_composite[i]) {
            primes[prime_count++] = i;
            mu[i] = -1;
        }

        for (int j = 0; j < prime_count; j++) {
            long long composite = (long long)i * primes[j];
            if (composite > n) {
                break;
            }

            is_composite[(int)composite] = 1;
            if (i % primes[j] == 0) {
                mu[(int)composite] = 0;
                break;
            } else {
                mu[(int)composite] = -mu[i];
            }
        }
    }

    int sum = 0;
    for (int i = 1; i <= n; i++) sum += mu[i];
    free(mu);
    free(primes);
    free(is_composite);
    return sum;
}

int main(void) {
    printf("%d\n", mobius_function(1));
    printf("%d\n", mobius_function(10));
    printf("%d\n", mobius_function(50));
    return 0;
}
