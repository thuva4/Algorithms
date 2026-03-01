#include <algorithm>
#include <vector>

namespace {
struct Point {
    int x;
    int y;
};

bool operator<(const Point& lhs, const Point& rhs) {
    if (lhs.x != rhs.x) {
        return lhs.x < rhs.x;
    }
    return lhs.y < rhs.y;
}

bool operator==(const Point& lhs, const Point& rhs) {
    return lhs.x == rhs.x && lhs.y == rhs.y;
}

long long cross(const Point& a, const Point& b, const Point& c) {
    return static_cast<long long>(b.x - a.x) * (c.y - a.y)
        - static_cast<long long>(b.y - a.y) * (c.x - a.x);
}

std::vector<Point> build_convex_hull(std::vector<Point> points) {
    std::sort(points.begin(), points.end());
    points.erase(std::unique(points.begin(), points.end()), points.end());

    if (points.size() <= 1) {
        return points;
    }

    std::vector<Point> hull;
    hull.reserve(points.size() * 2);

    for (const Point& point : points) {
        while (hull.size() >= 2 && cross(hull[hull.size() - 2], hull.back(), point) <= 0) {
            hull.pop_back();
        }
        hull.push_back(point);
    }

    std::size_t lower_size = hull.size();
    for (std::size_t index = points.size() - 1; index > 0; --index) {
        const Point& point = points[index - 1];
        while (hull.size() > lower_size && cross(hull[hull.size() - 2], hull.back(), point) <= 0) {
            hull.pop_back();
        }
        hull.push_back(point);
    }

    if (!hull.empty()) {
        hull.pop_back();
    }

    return hull;
}
}  // namespace

int delaunay_triangulation(std::vector<int> arr) {
    if (arr.empty()) {
        return 0;
    }

    int point_count = arr[0];
    if (point_count < 3 || static_cast<int>(arr.size()) < 1 + point_count * 2) {
        return 0;
    }

    std::vector<Point> points;
    points.reserve(point_count);
    for (int index = 0; index < point_count; ++index) {
        points.push_back(Point{arr[1 + 2 * index], arr[1 + 2 * index + 1]});
    }

    std::sort(points.begin(), points.end());
    points.erase(std::unique(points.begin(), points.end()), points.end());
    if (points.size() < 3) {
        return 0;
    }

    int total_vertices = static_cast<int>(points.size());
    int hull_vertices = static_cast<int>(build_convex_hull(points).size());
    int triangles = 2 * total_vertices - 2 - hull_vertices;
    return std::max(0, triangles);
}
