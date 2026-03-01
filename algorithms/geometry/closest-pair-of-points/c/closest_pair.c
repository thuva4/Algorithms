#include "closest_pair.h"
#include <stdlib.h>
#include <limits.h>

typedef struct { int x, y; } Point;

static int dist_sq(Point a, Point b) {
    return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
}

static int cmp_x(const void* a, const void* b) {
    Point* pa = (Point*)a;
    Point* pb = (Point*)b;
    if (pa->x != pb->x) return pa->x - pb->x;
    return pa->y - pb->y;
}

static int cmp_y(const void* a, const void* b) {
    Point* pa = (Point*)a;
    Point* pb = (Point*)b;
    return pa->y - pb->y;
}

static int min_int(int a, int b) { return a < b ? a : b; }

static int solve(Point* pts, int l, int r) {
    if (r - l < 3) {
        int mn = INT_MAX;
        for (int i = l; i <= r; i++)
            for (int j = i + 1; j <= r; j++)
                mn = min_int(mn, dist_sq(pts[i], pts[j]));
        return mn;
    }

    int mid = (l + r) / 2;
    int midX = pts[mid].x;

    int dl = solve(pts, l, mid);
    int dr = solve(pts, mid + 1, r);
    int d = min_int(dl, dr);

    Point* strip = (Point*)malloc((r - l + 1) * sizeof(Point));
    int sn = 0;
    for (int i = l; i <= r; i++) {
        if ((pts[i].x - midX) * (pts[i].x - midX) < d)
            strip[sn++] = pts[i];
    }
    qsort(strip, sn, sizeof(Point), cmp_y);

    for (int i = 0; i < sn; i++) {
        for (int j = i + 1; j < sn &&
                (strip[j].y - strip[i].y) * (strip[j].y - strip[i].y) < d; j++) {
            d = min_int(d, dist_sq(strip[i], strip[j]));
        }
    }

    free(strip);
    return d;
}

int closest_pair(int* arr, int len) {
    int n = len / 2;
    Point* points = (Point*)malloc(n * sizeof(Point));
    for (int i = 0; i < n; i++) {
        points[i].x = arr[2 * i];
        points[i].y = arr[2 * i + 1];
    }
    qsort(points, n, sizeof(Point), cmp_x);
    int result = solve(points, 0, n - 1);
    free(points);
    return result;
}
