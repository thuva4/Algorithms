#include <vector>
#include <algorithm>
#include <climits>
#include <cmath>

using namespace std;

static int distSq(pair<int,int>& a, pair<int,int>& b) {
    return (a.first - b.first) * (a.first - b.first) +
           (a.second - b.second) * (a.second - b.second);
}

static int solve(vector<pair<int,int>>& pts, int l, int r) {
    if (r - l < 3) {
        int mn = INT_MAX;
        for (int i = l; i <= r; i++)
            for (int j = i + 1; j <= r; j++)
                mn = min(mn, distSq(pts[i], pts[j]));
        return mn;
    }

    int mid = (l + r) / 2;
    int midX = pts[mid].first;

    int dl = solve(pts, l, mid);
    int dr = solve(pts, mid + 1, r);
    int d = min(dl, dr);

    vector<pair<int,int>> strip;
    for (int i = l; i <= r; i++) {
        if ((pts[i].first - midX) * (pts[i].first - midX) < d)
            strip.push_back(pts[i]);
    }
    sort(strip.begin(), strip.end(), [](auto& a, auto& b) {
        return a.second < b.second;
    });

    for (int i = 0; i < (int)strip.size(); i++) {
        for (int j = i + 1; j < (int)strip.size() &&
                (strip[j].second - strip[i].second) * (strip[j].second - strip[i].second) < d; j++) {
            d = min(d, distSq(strip[i], strip[j]));
        }
    }

    return d;
}

int closest_pair(vector<int> arr) {
    int n = arr.size() / 2;
    vector<pair<int,int>> points(n);
    for (int i = 0; i < n; i++) {
        points[i] = {arr[2*i], arr[2*i+1]};
    }
    sort(points.begin(), points.end());
    return solve(points, 0, n - 1);
}
