#include <stdio.h>
#include "lz77_compression.h"

int lz77_compression(int* arr, int n) {
    int count = 0, i = 0;
    while (i < n) {
        int bestLen = 0, start = i - 256;
        if (start < 0) start = 0;
        int j;
        for (j = start; j < i; j++) {
            int len = 0, dist = i - j;
            while (i+len < n && len < dist && arr[j+len] == arr[i+len]) len++;
            if (len == dist) while (i+len < n && arr[j+(len%dist)] == arr[i+len]) len++;
            if (len > bestLen) bestLen = len;
        }
        if (bestLen >= 2) { count++; i += bestLen; } else i++;
    }
    return count;
}

int main() {
    int a1[] = {1,2,3,1,2,3}; printf("%d\n", lz77_compression(a1, 6));
    int a2[] = {5,5,5,5}; printf("%d\n", lz77_compression(a2, 4));
    int a3[] = {1,2,3,4}; printf("%d\n", lz77_compression(a3, 4));
    int a4[] = {1,2,1,2,3,4,3,4}; printf("%d\n", lz77_compression(a4, 8));
    return 0;
}
