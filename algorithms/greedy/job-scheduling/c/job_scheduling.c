#include "job_scheduling.h"
#include <stdlib.h>

static int cmp_profit(const void* a, const void* b) {
    int* ja = (int*)a;
    int* jb = (int*)b;
    return jb[1] - ja[1];
}

int job_scheduling(int* arr, int len) {
    int n = arr[0];
    int* jobs = (int*)malloc(n * 2 * sizeof(int));
    int maxDeadline = 0;

    for (int i = 0; i < n; i++) {
        jobs[2*i] = arr[1 + 2*i];
        jobs[2*i + 1] = arr[1 + 2*i + 1];
        if (jobs[2*i] > maxDeadline) maxDeadline = jobs[2*i];
    }

    qsort(jobs, n, 2 * sizeof(int), cmp_profit);

    int* slots = (int*)calloc(maxDeadline + 1, sizeof(int));
    int totalProfit = 0;

    for (int i = 0; i < n; i++) {
        int deadline = jobs[2*i];
        int profit = jobs[2*i + 1];
        int t = deadline < maxDeadline ? deadline : maxDeadline;
        for (; t > 0; t--) {
            if (!slots[t]) {
                slots[t] = 1;
                totalProfit += profit;
                break;
            }
        }
    }

    free(jobs);
    free(slots);
    return totalProfit;
}
