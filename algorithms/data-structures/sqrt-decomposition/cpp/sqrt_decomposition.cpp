#include <iostream>
#include <vector>
#include <cmath>
using namespace std;

class SqrtDecomposition {
    vector<int> a;
    vector<long long> blocks;
    int n, block_sz;
public:
    SqrtDecomposition(const vector<int>& arr) : a(arr), n(arr.size()) {
        block_sz = max(1, (int)sqrt(n));
        blocks.assign((n + block_sz - 1) / block_sz, 0);
        for (int i = 0; i < n; i++) blocks[i / block_sz] += a[i];
    }

    long long query(int l, int r) {
        long long result = 0;
        int bl = l / block_sz, br = r / block_sz;
        if (bl == br) {
            for (int i = l; i <= r; i++) result += a[i];
        } else {
            for (int i = l; i < (bl + 1) * block_sz; i++) result += a[i];
            for (int b = bl + 1; b < br; b++) result += blocks[b];
            for (int i = br * block_sz; i <= r; i++) result += a[i];
        }
        return result;
    }
};

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    SqrtDecomposition sd(arr);
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int l, r;
        cin >> l >> r;
        if (i) cout << ' ';
        cout << sd.query(l, r);
    }
    cout << endl;
    return 0;
}
