#include <iostream>
#include <vector>
using namespace std;

class BIT2D {
    vector<vector<long long>> tree;
    int rows, cols;
public:
    BIT2D(int r, int c) : rows(r), cols(c), tree(r + 1, vector<long long>(c + 1, 0)) {}

    void update(int r, int c, long long val) {
        for (int i = r + 1; i <= rows; i += i & (-i))
            for (int j = c + 1; j <= cols; j += j & (-j))
                tree[i][j] += val;
    }

    long long query(int r, int c) {
        long long s = 0;
        for (int i = r + 1; i > 0; i -= i & (-i))
            for (int j = c + 1; j > 0; j -= j & (-j))
                s += tree[i][j];
        return s;
    }
};

int main() {
    int rows, cols;
    cin >> rows >> cols;
    BIT2D bit(rows, cols);
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++) {
            int v; cin >> v;
            if (v) bit.update(r, c, v);
        }
    int q; cin >> q;
    bool first = true;
    while (q--) {
        int t, r, c, v; cin >> t >> r >> c >> v;
        if (t == 1) bit.update(r, c, v);
        else { if (!first) cout << ' '; cout << bit.query(r, c); first = false; }
    }
    cout << endl;
    return 0;
}
