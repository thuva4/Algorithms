#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class MergeSortTree {
    vector<vector<int>> tree;
    int n;

    void build(const vector<int>& a, int nd, int s, int e) {
        if (s == e) { tree[nd] = {a[s]}; return; }
        int m = (s + e) / 2;
        build(a, 2*nd, s, m); build(a, 2*nd+1, m+1, e);
        merge(tree[2*nd].begin(), tree[2*nd].end(),
              tree[2*nd+1].begin(), tree[2*nd+1].end(),
              back_inserter(tree[nd]));
    }

    int query(int nd, int s, int e, int l, int r, int k) {
        if (r < s || e < l) return 0;
        if (l <= s && e <= r) return upper_bound(tree[nd].begin(), tree[nd].end(), k) - tree[nd].begin();
        int m = (s + e) / 2;
        return query(2*nd, s, m, l, r, k) + query(2*nd+1, m+1, e, l, r, k);
    }

public:
    MergeSortTree(const vector<int>& a) : n(a.size()), tree(4 * a.size()) { build(a, 1, 0, n-1); }
    int countLeq(int l, int r, int k) { return query(1, 0, n-1, l, r, k); }
};

int main() {
    int n; cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    MergeSortTree mst(a);
    int q; cin >> q;
    for (int i = 0; i < q; i++) {
        int l, r, k; cin >> l >> r >> k;
        if (i) cout << ' ';
        cout << mst.countLeq(l, r, k);
    }
    cout << endl;
    return 0;
}
