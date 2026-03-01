#include "integer_sqrt.h"

int integer_sqrt(int arr[], int size) {
    long long n = arr[0];
    if (n <= 1) return (int)n;
    long long x = n;
    while (1) {
        long long x1 = (x + n / x) / 2;
        if (x1 >= x) return (int)x;
        x = x1;
    }
}
