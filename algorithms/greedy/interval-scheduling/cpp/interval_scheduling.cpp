#include <vector>
#include <algorithm>

using namespace std;

int interval_scheduling(vector<int> arr) {
    int n = arr[0];
    vector<pair<int,int>> intervals(n);
    for (int i = 0; i < n; i++) {
        intervals[i] = {arr[1 + 2*i], arr[1 + 2*i + 1]};
    }

    sort(intervals.begin(), intervals.end(), [](auto& a, auto& b) {
        return a.second < b.second;
    });

    int count = 0, lastEnd = -1;
    for (auto& iv : intervals) {
        if (iv.first >= lastEnd) {
            count++;
            lastEnd = iv.second;
        }
    }

    return count;
}
