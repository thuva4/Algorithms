#include <vector>

using namespace std;

int convex_hull_jarvis(vector<int> arr) {
    int n = arr[0];
    if (n < 2) return n;

    vector<int> px(n), py(n);
    for (int i = 0; i < n; i++) {
        px[i] = arr[1 + 2 * i];
        py[i] = arr[1 + 2 * i + 1];
    }

    auto cross = [&](int o, int a, int b) {
        return (px[a] - px[o]) * (py[b] - py[o]) - (py[a] - py[o]) * (px[b] - px[o]);
    };

    auto distSq = [&](int a, int b) {
        return (px[a] - px[b]) * (px[a] - px[b]) + (py[a] - py[b]) * (py[a] - py[b]);
    };

    int start = 0;
    for (int i = 1; i < n; i++) {
        if (px[i] < px[start] || (px[i] == px[start] && py[i] < py[start]))
            start = i;
    }

    vector<int> hull;
    int current = start;
    do {
        hull.push_back(current);
        int candidate = 0;
        for (int i = 1; i < n; i++) {
            if (i == current) continue;
            if (candidate == current) { candidate = i; continue; }
            int c = cross(current, candidate, i);
            if (c < 0) candidate = i;
            else if (c == 0 && distSq(current, i) > distSq(current, candidate))
                candidate = i;
        }
        current = candidate;
    } while (current != start);

    return (int)hull.size();
}
