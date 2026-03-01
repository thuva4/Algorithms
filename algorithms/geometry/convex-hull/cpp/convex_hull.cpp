#include <vector>
#include <algorithm>

int convex_hull_count(std::vector<int> arr) {
    int n = arr[0];
    if (n <= 2) return n;

    std::vector<std::pair<int, int>> points;
    int idx = 1;
    for (int i = 0; i < n; i++) {
        points.push_back({arr[idx], arr[idx + 1]});
        idx += 2;
    }
    std::sort(points.begin(), points.end());

    auto cross = [](std::pair<int,int> o, std::pair<int,int> a, std::pair<int,int> b) -> long long {
        return (long long)(a.first - o.first) * (b.second - o.second) - (long long)(a.second - o.second) * (b.first - o.first);
    };

    std::vector<std::pair<int,int>> hull;
    for (auto& p : points) {
        while (hull.size() >= 2 && cross(hull[hull.size()-2], hull[hull.size()-1], p) <= 0) hull.pop_back();
        hull.push_back(p);
    }

    int lower = static_cast<int>(hull.size()) + 1;
    for (int i = n - 2; i >= 0; i--) {
        while (static_cast<int>(hull.size()) >= lower && cross(hull[hull.size()-2], hull[hull.size()-1], points[i]) <= 0) hull.pop_back();
        hull.push_back(points[i]);
    }

    return static_cast<int>(hull.size()) - 1;
}
