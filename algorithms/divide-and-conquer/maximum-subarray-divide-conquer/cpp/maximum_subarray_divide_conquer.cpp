#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

long long helper(const vector<int>& arr, int lo, int hi) {
    if (lo == hi) return arr[lo];
    int mid = (lo + hi) / 2;

    long long leftSum = LLONG_MIN, s = 0;
    for (int i = mid; i >= lo; i--) { s += arr[i]; leftSum = max(leftSum, s); }
    long long rightSum = LLONG_MIN; s = 0;
    for (int i = mid + 1; i <= hi; i++) { s += arr[i]; rightSum = max(rightSum, s); }

    long long cross = leftSum + rightSum;
    long long leftMax = helper(arr, lo, mid);
    long long rightMax = helper(arr, mid + 1, hi);
    return max({leftMax, rightMax, cross});
}

long long max_subarray_dc(const vector<int>& arr) {
    return helper(arr, 0, arr.size() - 1);
}

int main() {
    int n; cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << max_subarray_dc(arr) << endl;
    return 0;
}
