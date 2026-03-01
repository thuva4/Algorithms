#include <limits.h>
#include <stdio.h>

char *floyd_warshall(int arr[], int size) {
    static char output[100000];
    static int dist[100][100];
    const int inf = INT_MAX / 4;
    int n = 0;
    while (n * n < size) {
        n++;
    }
    if (n * n != size || n <= 0 || n > 100) {
        output[0] = '\0';
        return output;
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            int value = arr[i * n + j];
            dist[i][j] = (value >= 1000000000) ? inf : value;
        }
    }

    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] < inf && dist[k][j] < inf && dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }

    int offset = 0;
    output[0] = '\0';
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (dist[i][j] >= inf) {
                offset += snprintf(output + offset, sizeof(output) - (size_t)offset, "%sInfinity",
                    (i == 0 && j == 0) ? "" : " ");
            } else {
                offset += snprintf(output + offset, sizeof(output) - (size_t)offset, "%s%d",
                    (i == 0 && j == 0) ? "" : " ", dist[i][j]);
            }
        }
    }
    return output;
}
