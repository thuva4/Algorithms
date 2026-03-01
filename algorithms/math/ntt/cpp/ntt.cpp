#include <vector>
#include <iostream>
using namespace std;

const long long MOD = 998244353;
const long long G_ROOT = 3;

long long mod_pow(long long base, long long exp, long long mod) {
    long long result = 1; base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        exp >>= 1;
        base = base * base % mod;
    }
    return result;
}

void ntt_transform(vector<long long>& a, bool invert) {
    int n = a.size();
    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        long long w = mod_pow(G_ROOT, (MOD - 1) / len, MOD);
        if (invert) w = mod_pow(w, MOD - 2, MOD);
        int half = len / 2;
        for (int i = 0; i < n; i += len) {
            long long wn = 1;
            for (int k = 0; k < half; k++) {
                long long u = a[i + k], v = a[i + k + half] * wn % MOD;
                a[i + k] = (u + v) % MOD;
                a[i + k + half] = (u - v + MOD) % MOD;
                wn = wn * w % MOD;
            }
        }
    }
    if (invert) {
        long long inv_n = mod_pow(n, MOD - 2, MOD);
        for (auto& x : a) x = x * inv_n % MOD;
    }
}

vector<int> ntt(const vector<int>& data) {
    int idx = 0;
    int na = data[idx++];
    vector<long long> a(na);
    for (int i = 0; i < na; i++) a[i] = ((long long)data[idx++] % MOD + MOD) % MOD;
    int nb = data[idx++];
    vector<long long> b(nb);
    for (int i = 0; i < nb; i++) b[i] = ((long long)data[idx++] % MOD + MOD) % MOD;

    int result_len = na + nb - 1;
    int n = 1;
    while (n < result_len) n <<= 1;

    a.resize(n, 0);
    b.resize(n, 0);
    ntt_transform(a, false);
    ntt_transform(b, false);
    for (int i = 0; i < n; i++) a[i] = a[i] * b[i] % MOD;
    ntt_transform(a, true);

    vector<int> result(result_len);
    for (int i = 0; i < result_len; i++) result[i] = (int)a[i];
    return result;
}

int main() {
    auto r = ntt({2, 1, 2, 2, 3, 4});
    for (int v : r) cout << v << " ";
    cout << endl;
    r = ntt({2, 1, 1, 2, 1, 1});
    for (int v : r) cout << v << " ";
    cout << endl;
    return 0;
}
