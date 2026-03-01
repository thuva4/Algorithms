#include <vector>
#include <algorithm>
#include <climits>
#include <iostream>
using namespace std;

struct Point { int x, y; };

struct KDNode {
    Point point;
    KDNode *left, *right;
    int axis;
};

KDNode* build(vector<Point>& pts, int lo, int hi, int depth) {
    if (lo >= hi) return nullptr;
    int axis = depth % 2;
    int mid = (lo + hi) / 2;
    nth_element(pts.begin() + lo, pts.begin() + mid, pts.begin() + hi,
        [axis](const Point& a, const Point& b) {
            return axis == 0 ? a.x < b.x : a.y < b.y;
        });
    KDNode* node = new KDNode{pts[mid], nullptr, nullptr, axis};
    node->left = build(pts, lo, mid, depth + 1);
    node->right = build(pts, mid + 1, hi, depth + 1);
    return node;
}

long long sqDist(Point a, Point b) {
    return (long long)(a.x - b.x) * (a.x - b.x) + (long long)(a.y - b.y) * (a.y - b.y);
}

void nearest(KDNode* node, Point q, long long& best) {
    if (!node) return;
    long long d = sqDist(node->point, q);
    if (d < best) best = d;

    int axis = node->axis;
    long long diff = axis == 0 ? q.x - node->point.x : q.y - node->point.y;

    KDNode *near = diff <= 0 ? node->left : node->right;
    KDNode *far = diff <= 0 ? node->right : node->left;

    nearest(near, q, best);
    if (diff * diff < best) nearest(far, q, best);
}

int kd_tree(const vector<int>& data) {
    int n = data[0];
    vector<Point> pts(n);
    int idx = 1;
    for (int i = 0; i < n; i++) {
        pts[i] = {data[idx], data[idx + 1]};
        idx += 2;
    }
    Point q = {data[idx], data[idx + 1]};
    KDNode* root = build(pts, 0, n, 0);
    long long best = LLONG_MAX;
    nearest(root, q, best);
    return (int)best;
}

int main() {
    cout << kd_tree({3, 1, 2, 3, 4, 5, 6, 3, 3}) << endl;
    cout << kd_tree({2, 0, 0, 5, 5, 0, 0}) << endl;
    cout << kd_tree({1, 3, 4, 0, 0}) << endl;
    return 0;
}
