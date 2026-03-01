#include <stdio.h>
#include "rope_data_structure.h"

int rope_data_structure(const int *data, int data_len) {
    int n1 = data[0];
    const int *arr1 = &data[1];
    int pos = 1 + n1;
    int n2 = data[pos];
    const int *arr2 = &data[pos + 1];
    int query_index = data[pos + 1 + n2];

    /* Concatenate and index */
    if (query_index < n1) {
        return arr1[query_index];
    } else {
        return arr2[query_index - n1];
    }
}

int main(void) {
    int data1[] = {3, 1, 2, 3, 2, 4, 5, 0};
    printf("%d\n", rope_data_structure(data1, 8));

    int data2[] = {3, 1, 2, 3, 2, 4, 5, 4};
    printf("%d\n", rope_data_structure(data2, 8));

    int data3[] = {3, 1, 2, 3, 2, 4, 5, 3};
    printf("%d\n", rope_data_structure(data3, 8));
    return 0;
}
