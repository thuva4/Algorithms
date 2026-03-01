#include "comb_sort.h"
#include <stdbool.h>

void comb_sort(int arr[], int n) {
    int gap = n;
    bool sorted = false;
    const double shrink = 1.3;

    while (!sorted) {
        gap = (int)((double)gap / shrink);
        if (gap <= 1) {
            gap = 1;
            sorted = true;
        }

        for (int i = 0; i < n - gap; i++) {
            if (arr[i] > arr[i + gap]) {
                int temp = arr[i];
                arr[i] = arr[i + gap];
                arr[i + gap] = temp;
                sorted = false;
            }
        }
    }
}
