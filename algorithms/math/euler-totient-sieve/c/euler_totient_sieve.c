#include <stdio.h>
#include <stdlib.h>
#include "euler_totient_sieve.h"

long long euler_totient_sieve(int n) {
    int *phi = (int *)malloc((n + 1) * sizeof(int));
    for (int i = 0; i <= n; i++) phi[i] = i;
    for (int i = 2; i <= n; i++) {
        if (phi[i] == i) {
            for (int j = i; j <= n; j += i) {
                phi[j] -= phi[j] / i;
            }
        }
    }
    long long sum = 0;
    for (int i = 1; i <= n; i++) sum += phi[i];
    free(phi);
    return sum;
}

int main(void) {
    printf("%lld\n", euler_totient_sieve(1));
    printf("%lld\n", euler_totient_sieve(10));
    printf("%lld\n", euler_totient_sieve(100));
    return 0;
}
