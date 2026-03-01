#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int range_tree(const vector<int>& data) {
    int n = data[0];
    vector<int> points(data.begin() + 1, data.begin() + 1 + n);
    sort(points.begin(), points.end());
    int lo = data[1 + n], hi = data[2 + n];
    auto left = lower_bound(points.begin(), points.end(), lo);
    auto right = upper_bound(points.begin(), points.end(), hi);
    return (int)(right - left);
}

int main() {
    cout << range_tree({5, 1, 3, 5, 7, 9, 2, 6}) << endl;
    cout << range_tree({4, 2, 4, 6, 8, 1, 10}) << endl;
    cout << range_tree({3, 1, 2, 3, 10, 20}) << endl;
    return 0;
}
