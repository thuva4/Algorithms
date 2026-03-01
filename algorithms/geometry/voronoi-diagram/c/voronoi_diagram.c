#include "voronoi_diagram.h"
#include <math.h>
#include <stdlib.h>

int voronoi_diagram(int* arr, int len) {
    int n = arr[0];
    if (n < 3) return 0;

    int* px = (int*)malloc(n * sizeof(int));
    int* py = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        px[i] = arr[1 + 2 * i];
        py[i] = arr[1 + 2 * i + 1];
    }

    double EPS = 1e-9;
    int maxVerts = n * n * n;
    long long* vx = (long long*)malloc(maxVerts * sizeof(long long));
    long long* vy = (long long*)malloc(maxVerts * sizeof(long long));
    int count = 0;

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                double ax = px[i], ay = py[i];
                double bx = px[j], by = py[j];
                double cx = px[k], cy = py[k];

                double d = 2.0 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
                if (fabs(d) < EPS) continue;

                double ux = ((ax*ax + ay*ay) * (by - cy) +
                             (bx*bx + by*by) * (cy - ay) +
                             (cx*cx + cy*cy) * (ay - by)) / d;
                double uy = ((ax*ax + ay*ay) * (cx - bx) +
                             (bx*bx + by*by) * (ax - cx) +
                             (cx*cx + cy*cy) * (bx - ax)) / d;

                double rSq = (ux - ax) * (ux - ax) + (uy - ay) * (uy - ay);

                int valid = 1;
                for (int m = 0; m < n; m++) {
                    if (m == i || m == j || m == k) continue;
                    double distSq = (ux - px[m]) * (ux - px[m]) + (uy - py[m]) * (uy - py[m]);
                    if (distSq < rSq - EPS) {
                        valid = 0;
                        break;
                    }
                }

                if (valid) {
                    long long rx = (long long)round(ux * 1000000);
                    long long ry = (long long)round(uy * 1000000);
                    int dup = 0;
                    for (int m = 0; m < count; m++) {
                        if (vx[m] == rx && vy[m] == ry) { dup = 1; break; }
                    }
                    if (!dup) {
                        vx[count] = rx;
                        vy[count] = ry;
                        count++;
                    }
                }
            }
        }
    }

    free(px); free(py); free(vx); free(vy);
    return count;
}
