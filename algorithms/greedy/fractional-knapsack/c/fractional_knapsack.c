#include "fractional_knapsack.h"

int fractional_knapsack(const int* arr, int size) {
    int capacity = arr[0];
    int n = arr[1];
    int values[100], weights[100];
    int idx = 2;
    for (int i = 0; i < n; i++) {
        values[i] = arr[idx++];
        weights[i] = arr[idx++];
    }

    /* Sort by value/weight ratio descending (simple bubble sort) */
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if ((double)values[j] / weights[j] < (double)values[j+1] / weights[j+1]) {
                int tv = values[j]; values[j] = values[j+1]; values[j+1] = tv;
                int tw = weights[j]; weights[j] = weights[j+1]; weights[j+1] = tw;
            }
        }
    }

    double total = 0;
    int remaining = capacity;
    for (int i = 0; i < n && remaining > 0; i++) {
        if (weights[i] <= remaining) {
            total += values[i];
            remaining -= weights[i];
        } else {
            total += (double)values[i] * remaining / weights[i];
            remaining = 0;
        }
    }
    return (int)(total * 100);
}
