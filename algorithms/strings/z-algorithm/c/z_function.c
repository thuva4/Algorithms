#include "z_function.h"
#include <string.h>

void z_function(int arr[], int n, int result[]) {
    memset(result, 0, sizeof(int) * n);
    int l = 0, r = 0;
    for (int i = 1; i < n; i++) {
        if (i < r) {
            result[i] = r - i < result[i - l] ? r - i : result[i - l];
        }
        while (i + result[i] < n && arr[result[i]] == arr[i + result[i]]) {
            result[i]++;
        }
        if (i + result[i] > r) {
            l = i;
            r = i + result[i];
        }
    }
}
