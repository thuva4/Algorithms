#include <vector>
#include <iostream>
using namespace std;

long long mod_pow(long long base, long long exp, long long mod) {
    long long result = 1; base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        exp >>= 1;
        base = base * base % mod;
    }
    return result;
}

int lucas_theorem(long long n, long long k, int p) {
    if (k > n) return 0;
    vector<long long> fact(p);
    fact[0] = 1;
    for (int i = 1; i < p; i++) fact[i] = fact[i - 1] * i % p;

    long long result = 1;
    while (n > 0 || k > 0) {
        int ni = n % p, ki = k % p;
        if (ki > ni) return 0;
        long long c = fact[ni] * mod_pow(fact[ki], p - 2, p) % p * mod_pow(fact[ni - ki], p - 2, p) % p;
        result = result * c % p;
        n /= p; k /= p;
    }
    return (int)result;
}

int main() {
    cout << lucas_theorem(10, 3, 7) << endl;
    cout << lucas_theorem(5, 2, 3) << endl;
    cout << lucas_theorem(100, 50, 13) << endl;
    return 0;
}
