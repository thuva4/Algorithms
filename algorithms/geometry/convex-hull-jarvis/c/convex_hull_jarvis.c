#include "convex_hull_jarvis.h"

static int cross(int ox, int oy, int ax, int ay, int bx, int by) {
    return (ax - ox) * (by - oy) - (ay - oy) * (bx - ox);
}

static int dist_sq(int ax, int ay, int bx, int by) {
    return (ax - bx) * (ax - bx) + (ay - by) * (ay - by);
}

int convex_hull_jarvis(int* arr, int len) {
    int n = arr[0];
    if (n < 2) return n;

    int* px = arr + 1;

    int start = 0;
    for (int i = 1; i < n; i++) {
        if (px[2*i] < px[2*start] || (px[2*i] == px[2*start] && px[2*i+1] < px[2*start+1]))
            start = i;
    }

    int hull_count = 0;
    int current = start;
    do {
        hull_count++;
        int candidate = 0;
        for (int i = 1; i < n; i++) {
            if (i == current) continue;
            if (candidate == current) { candidate = i; continue; }
            int c = cross(px[2*current], px[2*current+1],
                         px[2*candidate], px[2*candidate+1],
                         px[2*i], px[2*i+1]);
            if (c < 0) {
                candidate = i;
            } else if (c == 0) {
                if (dist_sq(px[2*current], px[2*current+1], px[2*i], px[2*i+1]) >
                    dist_sq(px[2*current], px[2*current+1], px[2*candidate], px[2*candidate+1]))
                    candidate = i;
            }
        }
        current = candidate;
    } while (current != start);

    return hull_count;
}
