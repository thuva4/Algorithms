#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "cuckoo_hashing.h"

static int mod(int a, int m) {
    return ((a % m) + m) % m;
}

int cuckoo_hashing(const int *data, int data_len) {
    int n = data[0];
    if (n == 0) return 0;

    int capacity = 2 * n > 11 ? 2 * n : 11;
    int *table1 = (int *)malloc(capacity * sizeof(int));
    int *table2 = (int *)malloc(capacity * sizeof(int));
    memset(table1, -1, capacity * sizeof(int));
    memset(table2, -1, capacity * sizeof(int));

    /* Simple set using sorted array for tracking inserted keys */
    int *inserted = (int *)malloc(n * sizeof(int));
    int ins_count = 0;

    for (int i = 1; i <= n; i++) {
        int key = data[i];

        /* Check if already inserted */
        int found = 0;
        for (int j = 0; j < ins_count; j++) {
            if (inserted[j] == key) { found = 1; break; }
        }
        if (found) continue;

        /* Check if already in tables */
        if (table1[mod(key, capacity)] == key || table2[mod(key / capacity + 1, capacity)] == key) {
            inserted[ins_count++] = key;
            continue;
        }

        int current = key;
        int success = 0;
        for (int iter = 0; iter < 2 * capacity; iter++) {
            int pos1 = mod(current, capacity);
            if (table1[pos1] == -1) {
                table1[pos1] = current;
                success = 1;
                break;
            }
            int tmp = table1[pos1];
            table1[pos1] = current;
            current = tmp;

            int pos2 = mod(current / capacity + 1, capacity);
            if (table2[pos2] == -1) {
                table2[pos2] = current;
                success = 1;
                break;
            }
            tmp = table2[pos2];
            table2[pos2] = current;
            current = tmp;
        }
        if (success) inserted[ins_count++] = key;
    }

    free(table1);
    free(table2);
    free(inserted);
    return ins_count;
}

int main(void) {
    int data1[] = {3, 10, 20, 30};
    printf("%d\n", cuckoo_hashing(data1, 4));

    int data2[] = {4, 5, 5, 5, 5};
    printf("%d\n", cuckoo_hashing(data2, 5));

    int data3[] = {5, 1, 2, 3, 4, 5};
    printf("%d\n", cuckoo_hashing(data3, 6));
    return 0;
}
