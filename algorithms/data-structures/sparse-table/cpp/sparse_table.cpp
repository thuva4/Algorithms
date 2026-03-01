#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>
using namespace std;

class SparseTable {
    vector<vector<int>> table;
    vector<int> lg;
public:
    SparseTable(const vector<int>& arr) {
        int n = arr.size();
        int k = 1;
        while ((1 << k) <= n) k++;
        table.assign(k, vector<int>(n));
        lg.assign(n + 1, 0);
        for (int i = 2; i <= n; i++) lg[i] = lg[i/2] + 1;

        table[0] = arr;
        for (int j = 1; j < k; j++)
            for (int i = 0; i + (1 << j) <= n; i++)
                table[j][i] = min(table[j-1][i], table[j-1][i + (1 << (j-1))]);
    }

    int query(int l, int r) {
        int k = lg[r - l + 1];
        return min(table[k][l], table[k][r - (1 << k) + 1]);
    }
};

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    SparseTable st(arr);
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int l, r;
        cin >> l >> r;
        if (i) cout << ' ';
        cout << st.query(l, r);
    }
    cout << endl;
    return 0;
}
