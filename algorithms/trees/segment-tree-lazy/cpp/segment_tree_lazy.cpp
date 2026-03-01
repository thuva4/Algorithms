#include <iostream>
#include <vector>
using namespace std;

class SegTreeLazy {
    vector<long long> tree, lazy;
    int n;

    void build(const vector<int>& a, int nd, int s, int e) {
        if (s == e) { tree[nd] = a[s]; return; }
        int m = (s + e) / 2;
        build(a, 2*nd, s, m); build(a, 2*nd+1, m+1, e);
        tree[nd] = tree[2*nd] + tree[2*nd+1];
    }

    void apply(int nd, int s, int e, long long v) {
        tree[nd] += v * (e - s + 1); lazy[nd] += v;
    }

    void pushDown(int nd, int s, int e) {
        if (lazy[nd]) {
            int m = (s + e) / 2;
            apply(2*nd, s, m, lazy[nd]);
            apply(2*nd+1, m+1, e, lazy[nd]);
            lazy[nd] = 0;
        }
    }

    void update(int nd, int s, int e, int l, int r, long long v) {
        if (r < s || e < l) return;
        if (l <= s && e <= r) { apply(nd, s, e, v); return; }
        pushDown(nd, s, e);
        int m = (s + e) / 2;
        update(2*nd, s, m, l, r, v);
        update(2*nd+1, m+1, e, l, r, v);
        tree[nd] = tree[2*nd] + tree[2*nd+1];
    }

    long long query(int nd, int s, int e, int l, int r) {
        if (r < s || e < l) return 0;
        if (l <= s && e <= r) return tree[nd];
        pushDown(nd, s, e);
        int m = (s + e) / 2;
        return query(2*nd, s, m, l, r) + query(2*nd+1, m+1, e, l, r);
    }

public:
    SegTreeLazy(const vector<int>& a) : n(a.size()), tree(4*a.size()), lazy(4*a.size()) {
        build(a, 1, 0, n-1);
    }
    void update(int l, int r, long long v) { update(1, 0, n-1, l, r, v); }
    long long query(int l, int r) { return query(1, 0, n-1, l, r); }
};

int main() {
    int n; cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    SegTreeLazy st(a);
    int q; cin >> q;
    bool first = true;
    while (q--) {
        int t, l, r, v; cin >> t >> l >> r >> v;
        if (t == 1) st.update(l, r, v);
        else { if (!first) cout << ' '; cout << st.query(l, r); first = false; }
    }
    cout << endl;
    return 0;
}
