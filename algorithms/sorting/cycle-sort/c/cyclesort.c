#include <stdio.h>

void cycleSort(int arr[], int n) {
    for (int cycleStart = 0; cycleStart < n - 1; cycleStart++) {
        int item = arr[cycleStart];

        /* Find the position where we put the item */
        int pos = cycleStart;
        for (int i = cycleStart + 1; i < n; i++) {
            if (arr[i] < item) {
                pos++;
            }
        }

        /* If the item is already in the correct position */
        if (pos == cycleStart) {
            continue;
        }

        /* Skip duplicates */
        while (item == arr[pos]) {
            pos++;
        }

        /* Put the item to its correct position */
        if (pos != cycleStart) {
            int temp = item;
            item = arr[pos];
            arr[pos] = temp;
        }

        /* Rotate the rest of the cycle */
        while (pos != cycleStart) {
            pos = cycleStart;

            for (int i = cycleStart + 1; i < n; i++) {
                if (arr[i] < item) {
                    pos++;
                }
            }

            while (item == arr[pos]) {
                pos++;
            }

            if (item != arr[pos]) {
                int temp = item;
                item = arr[pos];
                arr[pos] = temp;
            }
        }
    }
}

int main() {
    int arr[] = {5, 3, 8, 1, 2, -3, 0};
    int n = sizeof(arr) / sizeof(arr[0]);

    cycleSort(arr, n);

    printf("Sorted array: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    return 0;
}
