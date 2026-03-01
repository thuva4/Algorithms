#include "minimum_cut_stoer_wagner.h"
#include <string.h>
#include <limits.h>

#define MAX_V 300

static int w[MAX_V][MAX_V];

int minimum_cut_stoer_wagner(int arr[], int size) {
    int n = arr[0];
    int m = arr[1];
    memset(w, 0, sizeof(w));
    int idx = 2;
    for (int i = 0; i < m; i++) {
        int u = arr[idx], v = arr[idx + 1], c = arr[idx + 2];
        w[u][v] += c;
        w[v][u] += c;
        idx += 3;
    }

    int merged[MAX_V];
    memset(merged, 0, sizeof(int) * n);
    int best = INT_MAX;

    for (int phase = 0; phase < n - 1; phase++) {
        int key[MAX_V];
        int inA[MAX_V];
        memset(key, 0, sizeof(int) * n);
        memset(inA, 0, sizeof(int) * n);
        int prev = -1, last = -1;

        for (int it = 0; it < n - phase; it++) {
            int sel = -1;
            for (int v = 0; v < n; v++) {
                if (!merged[v] && !inA[v]) {
                    if (sel == -1 || key[v] > key[sel]) {
                        sel = v;
                    }
                }
            }
            inA[sel] = 1;
            prev = last;
            last = sel;
            for (int v = 0; v < n; v++) {
                if (!merged[v] && !inA[v]) {
                    key[v] += w[sel][v];
                }
            }
        }

        if (key[last] < best) best = key[last];

        for (int v = 0; v < n; v++) {
            w[prev][v] += w[last][v];
            w[v][prev] += w[v][last];
        }
        merged[last] = 1;
    }

    return best;
}
