#include "count_set_bits.h"

int count_set_bits(int arr[], int n) {
    int total = 0;
    for (int i = 0; i < n; i++) {
        int num = arr[i];
        while (num) {
            total++;
            num &= (num - 1);
        }
    }
    return total;
}
