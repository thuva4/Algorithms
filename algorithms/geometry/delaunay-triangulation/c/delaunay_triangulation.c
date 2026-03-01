#include "delaunay_triangulation.h"
#include <stdlib.h>

typedef struct {
    int x;
    int y;
} Point;

static int compare_points(const void *a, const void *b) {
    const Point *pa = (const Point *)a;
    const Point *pb = (const Point *)b;
    if (pa->x != pb->x) {
        return pa->x - pb->x;
    }
    return pa->y - pb->y;
}

static long long cross(const Point *o, const Point *a, const Point *b) {
    return (long long)(a->x - o->x) * (b->y - o->y)
        - (long long)(a->y - o->y) * (b->x - o->x);
}

static int convex_hull_vertex_count(Point *points, int n) {
    if (n <= 1) {
        return n;
    }

    qsort(points, n, sizeof(Point), compare_points);

    Point *hull = (Point *)malloc((2 * n) * sizeof(Point));
    int k = 0;

    for (int i = 0; i < n; i++) {
        while (k >= 2 && cross(&hull[k - 2], &hull[k - 1], &points[i]) <= 0) {
            k--;
        }
        hull[k++] = points[i];
    }

    int lower_size = k;
    for (int i = n - 2; i >= 0; i--) {
        while (k > lower_size && cross(&hull[k - 2], &hull[k - 1], &points[i]) <= 0) {
            k--;
        }
        hull[k++] = points[i];
    }

    free(hull);
    return k - 1;
}

int delaunay_triangulation(int *arr, int len) {
    if (len <= 0) {
        return 0;
    }

    int n = arr[0];
    if (n < 3 || len < 1 + 2 * n) {
        return 0;
    }

    Point *points = (Point *)malloc(n * sizeof(Point));
    for (int i = 0; i < n; i++) {
        points[i].x = arr[1 + 2 * i];
        points[i].y = arr[1 + 2 * i + 1];
    }

    int hull_vertices = convex_hull_vertex_count(points, n);
    free(points);

    int triangle_count = 2 * n - 2 - hull_vertices;
    return triangle_count > 0 ? triangle_count : 0;
}
