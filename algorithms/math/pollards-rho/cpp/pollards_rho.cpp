#include <iostream>
#include <cmath>
#include <algorithm>
#include <stack>
using namespace std;

bool isPrime(long long n) {
    if (n < 2) return false;
    if (n < 4) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (long long i = 5; i * i <= n; i += 6)
        if (n % i == 0 || n % (i + 2) == 0) return false;
    return true;
}

long long gcd(long long a, long long b) {
    while (b) { long long t = b; b = a % b; a = t; }
    return a;
}

long long rho(long long n) {
    if (n % 2 == 0) return 2;
    long long x = 2, y = 2, c = 1, d = 1;
    while (d == 1) {
        x = ((__int128)x * x + c) % n;
        y = ((__int128)y * y + c) % n;
        y = ((__int128)y * y + c) % n;
        d = gcd(abs(x - y), n);
    }
    return d != n ? d : n;
}

long long pollards_rho(long long n) {
    if (n <= 1) return n;
    if (isPrime(n)) return n;
    long long smallest = n;
    stack<long long> st;
    st.push(n);
    while (!st.empty()) {
        long long num = st.top(); st.pop();
        if (num <= 1) continue;
        if (isPrime(num)) { smallest = min(smallest, num); continue; }
        long long d = rho(num);
        if (d == num) {
            for (long long c = 2; c < 20; c++) {
                long long xx = 2, yy = 2;
                d = 1;
                while (d == 1) {
                    xx = ((__int128)xx * xx + c) % num;
                    yy = ((__int128)yy * yy + c) % num;
                    yy = ((__int128)yy * yy + c) % num;
                    d = gcd(abs(xx - yy), num);
                }
                if (d != num) break;
            }
        }
        st.push(d);
        st.push(num / d);
    }
    return smallest;
}

int main() {
    cout << pollards_rho(15) << endl;
    cout << pollards_rho(13) << endl;
    cout << pollards_rho(91) << endl;
    cout << pollards_rho(221) << endl;
    return 0;
}
