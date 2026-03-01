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

long long extended_gcd(long long a, long long b, long long &x, long long &y) {
    if (a == 0) { x = 0; y = 1; return b; }
    long long x1, y1;
    long long g = extended_gcd(b % a, a, x1, y1);
    x = y1 - (b / a) * x1;
    y = x1;
    return g;
}

long long mod_inverse(long long e, long long phi) {
    long long x, y;
    extended_gcd(e, phi, x, y);
    return (x % phi + phi) % phi;
}

long long rsa_algorithm(long long p, long long q, long long e, long long message) {
    long long n = p * q;
    long long phi = (p - 1) * (q - 1);
    long long d = mod_inverse(e, phi);
    long long cipher = mod_pow(message, e, n);
    long long plain = mod_pow(cipher, d, n);
    return plain;
}

int main() {
    cout << rsa_algorithm(61, 53, 17, 65) << endl;
    cout << rsa_algorithm(61, 53, 17, 42) << endl;
    cout << rsa_algorithm(11, 13, 7, 9) << endl;
    return 0;
}
