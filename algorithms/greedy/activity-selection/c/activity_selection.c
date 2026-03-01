#include "activity_selection.h"
#include <stdlib.h>

static int compare_by_finish(const void *a, const void *b) {
    const int *actA = (const int *)a;
    const int *actB = (const int *)b;
    return actA[1] - actB[1];
}

int activity_selection(int arr[], int size) {
    int n = size / 2;
    if (n == 0) {
        return 0;
    }

    int (*activities)[2] = malloc(n * sizeof(*activities));
    for (int i = 0; i < n; i++) {
        activities[i][0] = arr[2 * i];
        activities[i][1] = arr[2 * i + 1];
    }

    qsort(activities, n, sizeof(*activities), compare_by_finish);

    int count = 1;
    int lastFinish = activities[0][1];

    for (int i = 1; i < n; i++) {
        if (activities[i][0] >= lastFinish) {
            count++;
            lastFinish = activities[i][1];
        }
    }

    free(activities);
    return count;
}
