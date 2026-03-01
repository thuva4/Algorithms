#include <iostream>
#include <vector>
using namespace std;

struct Node { long long val; int left, right; };
vector<Node> nodes;
int newNode(long long v, int l = 0, int r = 0) {
    nodes.push_back({v, l, r}); return nodes.size() - 1;
}

int build(const vector<int>& a, int s, int e) {
    if (s == e) return newNode(a[s]);
    int m = (s + e) / 2;
    int l = build(a, s, m), r = build(a, m + 1, e);
    return newNode(nodes[l].val + nodes[r].val, l, r);
}

int update(int nd, int s, int e, int idx, int val) {
    if (s == e) return newNode(val);
    int m = (s + e) / 2;
    if (idx <= m) {
        int nl = update(nodes[nd].left, s, m, idx, val);
        return newNode(nodes[nl].val + nodes[nodes[nd].right].val, nl, nodes[nd].right);
    } else {
        int nr = update(nodes[nd].right, m + 1, e, idx, val);
        return newNode(nodes[nodes[nd].left].val + nodes[nr].val, nodes[nd].left, nr);
    }
}

long long query(int nd, int s, int e, int l, int r) {
    if (r < s || e < l) return 0;
    if (l <= s && e <= r) return nodes[nd].val;
    int m = (s + e) / 2;
    return query(nodes[nd].left, s, m, l, r) + query(nodes[nd].right, m + 1, e, l, r);
}

int main() {
    int n; cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    nodes.reserve(4 * n + 200000);
    vector<int> roots;
    roots.push_back(build(a, 0, n - 1));
    int q; cin >> q;
    bool first = true;
    while (q--) {
        int t, a1, b1, c1; cin >> t >> a1 >> b1 >> c1;
        if (t == 1) roots.push_back(update(roots[a1], 0, n - 1, b1, c1));
        else { if (!first) cout << ' '; cout << query(roots[a1], 0, n - 1, b1, c1); first = false; }
    }
    cout << endl;
    return 0;
}
