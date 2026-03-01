#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class DisjointSparseTable {
    vector<vector<long long>> table;
    vector<long long> a;
    int sz, levels;
public:
    DisjointSparseTable(const vector<int>& arr) {
        int n = arr.size();
        sz = 1; levels = 0;
        while (sz < n) { sz <<= 1; levels++; }
        if (levels == 0) levels = 1;
        a.assign(sz, 0);
        for (int i = 0; i < n; i++) a[i] = arr[i];
        table.assign(levels, vector<long long>(sz, 0));
        build();
    }

    void build() {
        for (int level = 0; level < levels; level++) {
            int block = 1 << (level + 1);
            int half = block >> 1;
            for (int start = 0; start < sz; start += block) {
                int mid = start + half;
                table[level][mid] = a[mid];
                for (int i = mid + 1; i < min(start + block, sz); i++)
                    table[level][i] = table[level][i - 1] + a[i];
                if (mid - 1 >= start) {
                    table[level][mid - 1] = a[mid - 1];
                    for (int i = mid - 2; i >= start; i--)
                        table[level][i] = table[level][i + 1] + a[i];
                }
            }
        }
    }

    long long query(int l, int r) {
        if (l == r) return a[l];
        int level = 31 - __builtin_clz(l ^ r);
        return table[level][l] + table[level][r];
    }
};

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    DisjointSparseTable dst(arr);
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int l, r;
        cin >> l >> r;
        if (i) cout << ' ';
        cout << dst.query(l, r);
    }
    cout << endl;
    return 0;
}
