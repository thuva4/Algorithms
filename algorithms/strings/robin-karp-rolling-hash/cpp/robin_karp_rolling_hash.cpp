#include <iostream>
#include <vector>
using namespace std;

int robinKarpRollingHash(const vector<int>& arr) {
    int idx = 0;
    int tlen = arr[idx++];
    vector<int> text(arr.begin()+idx, arr.begin()+idx+tlen); idx += tlen;
    int plen = arr[idx++];
    vector<int> pattern(arr.begin()+idx, arr.begin()+idx+plen);
    if (plen > tlen) return -1;

    long long BASE = 31, MOD = 1000000007;
    long long pHash = 0, tHash = 0, power = 1;

    for (int i = 0; i < plen; i++) {
        pHash = (pHash + (long long)(pattern[i]+1) * power) % MOD;
        tHash = (tHash + (long long)(text[i]+1) * power) % MOD;
        if (i < plen-1) power = power * BASE % MOD;
    }

    auto modpow = [](long long base, long long exp, long long mod) {
        long long r = 1; base %= mod;
        while (exp > 0) { if (exp&1) r = r*base%mod; exp >>= 1; base = base*base%mod; }
        return r;
    };

    long long invBase = modpow(BASE, MOD-2, MOD);

    for (int i = 0; i <= tlen-plen; i++) {
        if (tHash == pHash) {
            bool match = true;
            for (int j = 0; j < plen; j++) if (text[i+j] != pattern[j]) { match = false; break; }
            if (match) return i;
        }
        if (i < tlen-plen) {
            tHash = ((tHash - (text[i]+1)) % MOD + MOD) % MOD;
            tHash = tHash * invBase % MOD;
            tHash = (tHash + (long long)(text[i+plen]+1) * power) % MOD;
        }
    }
    return -1;
}

int main() {
    cout << robinKarpRollingHash({5, 1, 2, 3, 4, 5, 2, 1, 2}) << endl;
    cout << robinKarpRollingHash({5, 1, 2, 3, 4, 5, 2, 3, 4}) << endl;
    cout << robinKarpRollingHash({4, 1, 2, 3, 4, 2, 5, 6}) << endl;
    cout << robinKarpRollingHash({4, 1, 2, 3, 4, 1, 4}) << endl;
    return 0;
}
