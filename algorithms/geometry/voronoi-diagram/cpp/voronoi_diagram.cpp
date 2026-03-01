#include <vector>
#include <set>
#include <cmath>
#include <utility>

using namespace std;

int voronoi_diagram(vector<int> arr) {
    int n = arr[0];
    vector<int> px(n), py(n);
    for (int i = 0; i < n; i++) {
        px[i] = arr[1 + 2 * i];
        py[i] = arr[1 + 2 * i + 1];
    }

    if (n < 3) return 0;

    double EPS = 1e-9;
    set<pair<long long, long long>> vertices;

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

                bool valid = true;
                for (int m = 0; m < n; m++) {
                    if (m == i || m == j || m == k) continue;
                    double distSq = (ux - px[m]) * (ux - px[m]) + (uy - py[m]) * (uy - py[m]);
                    if (distSq < rSq - EPS) {
                        valid = false;
                        break;
                    }
                }

                if (valid) {
                    long long rx = llround(ux * 1000000);
                    long long ry = llround(uy * 1000000);
                    vertices.insert({rx, ry});
                }
            }
        }
    }

    return (int)vertices.size();
}
