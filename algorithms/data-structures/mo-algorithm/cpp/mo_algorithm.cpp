#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

vector<long long> mo_algorithm(int n, const vector<int>& arr, const vector<pair<int,int>>& queries) {
    int q = queries.size();
    int block = max(1, (int)sqrt(n));
    vector<int> order(q);
    for (int i = 0; i < q; i++) order[i] = i;
    sort(order.begin(), order.end(), [&](int a, int b) {
        int ba = queries[a].first / block, bb = queries[b].first / block;
        if (ba != bb) return ba < bb;
        return (ba & 1) ? queries[a].second > queries[b].second : queries[a].second < queries[b].second;
    });

    vector<long long> results(q);
    int curL = 0, curR = -1;
    long long curSum = 0;
    for (int idx : order) {
        int l = queries[idx].first, r = queries[idx].second;
        while (curR < r) curSum += arr[++curR];
        while (curL > l) curSum += arr[--curL];
        while (curR > r) curSum -= arr[curR--];
        while (curL < l) curSum -= arr[curL++];
        results[idx] = curSum;
    }
    return results;
}

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    int q;
    cin >> q;
    vector<pair<int,int>> queries(q);
    for (int i = 0; i < q; i++) cin >> queries[i].first >> queries[i].second;
    auto results = mo_algorithm(n, arr, queries);
    for (int i = 0; i < q; i++) {
        if (i) cout << ' ';
        cout << results[i];
    }
    cout << endl;
    return 0;
}
