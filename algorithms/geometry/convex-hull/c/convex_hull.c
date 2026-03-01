#include "convex_hull.h"

static long long cross(int ox, int oy, int ax, int ay, int bx, int by) {
    return (long long)(ax - ox) * (by - oy) - (long long)(ay - oy) * (bx - ox);
}

static void sort_points(int* px, int* py, int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (px[j] > px[j+1] || (px[j] == px[j+1] && py[j] > py[j+1])) {
                int tx = px[j]; px[j] = px[j+1]; px[j+1] = tx;
                int ty = py[j]; py[j] = py[j+1]; py[j+1] = ty;
            }
        }
    }
}

int convex_hull_count(const int* arr, int size) {
    int n = arr[0];
    if (n <= 2) return n;

    int px[1000], py[1000];
    int idx = 1;
    for (int i = 0; i < n; i++) { px[i] = arr[idx++]; py[i] = arr[idx++]; }
    sort_points(px, py, n);

    int hx[2000], hy[2000];
    int k = 0;

    for (int i = 0; i < n; i++) {
        while (k >= 2 && cross(hx[k-2], hy[k-2], hx[k-1], hy[k-1], px[i], py[i]) <= 0) k--;
        hx[k] = px[i]; hy[k] = py[i]; k++;
    }

    int lower = k + 1;
    for (int i = n - 2; i >= 0; i--) {
        while (k >= lower && cross(hx[k-2], hy[k-2], hx[k-1], hy[k-1], px[i], py[i]) <= 0) k--;
        hx[k] = px[i]; hy[k] = py[i]; k++;
    }

    return k - 1;
}
