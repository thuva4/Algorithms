#include "point_in_polygon.h"

int point_in_polygon(int* arr, int len) {
    int px = arr[0], py = arr[1];
    int n = arr[2];

    int inside = 0;
    int j = n - 1;
    for (int i = 0; i < n; i++) {
        int xi = arr[3 + 2 * i], yi = arr[3 + 2 * i + 1];
        int xj = arr[3 + 2 * j], yj = arr[3 + 2 * j + 1];

        if ((yi > py) != (yj > py) &&
            px < (double)(xj - xi) * (py - yi) / (yj - yi) + xi) {
            inside = !inside;
        }
        j = i;
    }

    return inside;
}
