#include <math.h>
#include <stdio.h>
#include <stdlib.h>

char *segmented_sieve(int low, int high) {
    static char output[100000];
    int offset = 0;

    if (high < 2 || low > high) {
        output[0] = '\0';
        return output;
    }
    if (low < 2) low = 2;

    int limit = (int)sqrt((double)high);
    int *base_mark = (int *)calloc((size_t)(limit + 1), sizeof(int));
    int *primes = (int *)malloc((size_t)(limit + 1) * sizeof(int));
    int prime_count = 0;

    for (int i = 2; i <= limit; i++) {
        if (!base_mark[i]) {
            primes[prime_count++] = i;
            if ((long long)i * i <= limit) {
                for (int j = i * i; j <= limit; j += i) {
                    base_mark[j] = 1;
                }
            }
        }
    }

    int range = high - low + 1;
    int *mark = (int *)calloc((size_t)range, sizeof(int));

    for (int i = 0; i < prime_count; i++) {
        int p = primes[i];
        long long start = ((long long)low + p - 1) / p * p;
        if (start < (long long)p * p) {
            start = (long long)p * p;
        }
        for (long long x = start; x <= high; x += p) {
            mark[(int)(x - low)] = 1;
        }
    }

    output[0] = '\0';
    for (int i = 0; i < range; i++) {
        if (!mark[i]) {
            offset += snprintf(
                output + offset,
                sizeof(output) - (size_t)offset,
                "%s%d",
                offset == 0 ? "" : " ",
                low + i
            );
        }
    }

    free(base_mark);
    free(primes);
    free(mark);
    return output;
}
