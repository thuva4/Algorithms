#include <stdio.h>

char *sumset(int arr[], int size) {
    static char output[100000];
    int len_a;
    int len_b;
    int offset = 0;
    int sums[10000];
    int count = 0;

    if (size < 2) {
        output[0] = '\0';
        return output;
    }

    len_a = arr[0];
    if (1 + len_a >= size) {
        output[0] = '\0';
        return output;
    }
    len_b = arr[1 + len_a];
    if (2 + len_a + len_b > size) {
        output[0] = '\0';
        return output;
    }

    for (int j = 0; j < len_b; j++) {
        int b = arr[2 + len_a + j];
        for (int i = 0; i < len_a; i++) {
            int a = arr[1 + i];
            sums[count++] = a + b;
        }
    }

    for (int i = 0; i < count; i++) {
        for (int j = i + 1; j < count; j++) {
            if (sums[j] < sums[i]) {
                int temp = sums[i];
                sums[i] = sums[j];
                sums[j] = temp;
            }
        }
    }

    output[0] = '\0';
    for (int i = 0; i < count; i++) {
        offset += snprintf(
            output + offset,
            sizeof(output) - (size_t)offset,
            "%s%d",
            offset == 0 ? "" : " ",
            sums[i]
        );
    }

    return output;
}
