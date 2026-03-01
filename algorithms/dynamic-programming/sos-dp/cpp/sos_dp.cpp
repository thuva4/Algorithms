#include <iostream>
#include <vector>
using namespace std;

vector<int> sosDp(int n, vector<int>& f) {
    int size = 1 << n;
    vector<int> sos(f.begin(), f.end());

    for (int i = 0; i < n; i++) {
        for (int mask = 0; mask < size; mask++) {
            if (mask & (1 << i)) {
                sos[mask] += sos[mask ^ (1 << i)];
            }
        }
    }
    return sos;
}

int main() {
    int n;
    cin >> n;
    int size = 1 << n;
    vector<int> f(size);
    for (int i = 0; i < size; i++) cin >> f[i];
    vector<int> result = sosDp(n, f);
    for (int i = 0; i < size; i++) {
        if (i > 0) cout << ' ';
        cout << result[i];
    }
    cout << endl;
    return 0;
}
