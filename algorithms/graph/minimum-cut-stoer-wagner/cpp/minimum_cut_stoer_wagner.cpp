#include <vector>
#include <climits>
#include <algorithm>

using namespace std;

int minimum_cut_stoer_wagner(vector<int> arr) {
    int n = arr[0];
    int m = arr[1];
    vector<vector<int>> w(n, vector<int>(n, 0));
    int idx = 2;
    for (int i = 0; i < m; i++) {
        int u = arr[idx], v = arr[idx + 1], c = arr[idx + 2];
        w[u][v] += c;
        w[v][u] += c;
        idx += 3;
    }

    vector<bool> merged(n, false);
    int best = INT_MAX;

    for (int phase = 0; phase < n - 1; phase++) {
        vector<int> key(n, 0);
        vector<bool> inA(n, false);
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
            inA[sel] = true;
            prev = last;
            last = sel;
            for (int v = 0; v < n; v++) {
                if (!merged[v] && !inA[v]) {
                    key[v] += w[sel][v];
                }
            }
        }

        best = min(best, key[last]);

        for (int v = 0; v < n; v++) {
            w[prev][v] += w[last][v];
            w[v][prev] += w[v][last];
        }
        merged[last] = true;
    }

    return best;
}
