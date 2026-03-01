#include "hungarian_algorithm.h"
#include <stdlib.h>
#include <limits.h>
#include <stdio.h>
#include <string.h>

int hungarian_impl(int n, const int* cost, int* assignment) {
    int* u = (int*)calloc(n + 1, sizeof(int));
    int* v = (int*)calloc(n + 1, sizeof(int));
    int* matchJob = (int*)calloc(n + 1, sizeof(int));
    int* dist = (int*)malloc((n + 1) * sizeof(int));
    int* used = (int*)calloc(n + 1, sizeof(int));
    int* prevJob = (int*)malloc((n + 1) * sizeof(int));

    for (int i = 1; i <= n; i++) {
        matchJob[0] = i;
        int j0 = 0;

        for (int j = 0; j <= n; j++) {
            dist[j] = INT_MAX;
            used[j] = 0;
            prevJob[j] = 0;
        }

        while (1) {
            used[j0] = 1;
            int w = matchJob[j0];
            int delta = INT_MAX, j1 = -1;

            for (int j = 1; j <= n; j++) {
                if (!used[j]) {
                    int cur = cost[(w - 1) * n + (j - 1)] - u[w] - v[j];
                    if (cur < dist[j]) {
                        dist[j] = cur;
                        prevJob[j] = j0;
                    }
                    if (dist[j] < delta) {
                        delta = dist[j];
                        j1 = j;
                    }
                }
            }

            for (int j = 0; j <= n; j++) {
                if (used[j]) {
                    u[matchJob[j]] += delta;
                    v[j] -= delta;
                } else {
                    dist[j] -= delta;
                }
            }

            j0 = j1;
            if (matchJob[j0] == 0) break;
        }

        while (j0 != 0) {
            matchJob[j0] = matchJob[prevJob[j0]];
            j0 = prevJob[j0];
        }
    }

    int totalCost = 0;
    for (int j = 1; j <= n; j++) {
        assignment[matchJob[j] - 1] = j - 1;
    }
    for (int i = 0; i < n; i++) {
        totalCost += cost[i * n + assignment[i]];
    }

    free(u);
    free(v);
    free(matchJob);
    free(dist);
    free(used);
    free(prevJob);

    return totalCost;
}

char *hungarian(int arr[], int size) {
    static char output[100000];
    static int assignment[128];
    int n = 0;
    while (n * n < size) {
        n++;
    }
    if (n * n != size || n <= 0 || n > 128) {
        output[0] = '\0';
        return output;
    }

    int totalCost = hungarian_impl(n, arr, assignment);
    int offset = 0;
    output[0] = '\0';
    for (int i = 0; i < n; i++) {
        offset += snprintf(output + offset, sizeof(output) - (size_t)offset, "%s%d",
            i == 0 ? "" : " ", assignment[i]);
    }
    offset += snprintf(output + offset, sizeof(output) - (size_t)offset, "%s%d",
        n == 0 ? "" : " ", totalCost);
    return output;
}

int main(void) {
    int cost[] = {9, 2, 7, 6, 4, 3, 5, 8, 1};
    int assignment[3];
    int totalCost = hungarian_impl(3, cost, assignment);
    printf("Assignment:");
    for (int i = 0; i < 3; i++) printf(" %d", assignment[i]);
    printf("\nTotal cost: %d\n", totalCost);
    return 0;
}
