#include <iostream>
using namespace std;

long long modPow(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1)
            result = (result * base) % mod;
        exp >>= 1;
        base = (base * base) % mod;
    }
    return result;
}

int main() {
    long long p = 23;   // publicly shared prime
    long long g = 5;    // publicly shared base (generator)

    long long a = 6;    // Alice's secret
    long long b = 15;   // Bob's secret

    // Alice sends A = g^a mod p
    long long A = modPow(g, a, p);
    cout << "Alice sends: " << A << endl;

    // Bob sends B = g^b mod p
    long long B = modPow(g, b, p);
    cout << "Bob sends: " << B << endl;

    // Shared secrets
    long long aliceSecret = modPow(B, a, p);
    cout << "Alice's shared secret: " << aliceSecret << endl;

    long long bobSecret = modPow(A, b, p);
    cout << "Bob's shared secret: " << bobSecret << endl;

    return 0;
}
