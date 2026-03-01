#include <vector>
#include <iostream>
using namespace std;

long long euler_totient_sieve(int n) {
    vector<int> phi(n + 1);
    for (int i = 0; i <= n; i++) phi[i] = i;
    for (int i = 2; i <= n; i++) {
        if (phi[i] == i) {
            for (int j = i; j <= n; j += i) {
                phi[j] -= phi[j] / i;
            }
        }
    }
    long long sum = 0;
    for (int i = 1; i <= n; i++) sum += phi[i];
    return sum;
}

int main() {
    cout << euler_totient_sieve(1) << endl;
    cout << euler_totient_sieve(10) << endl;
    cout << euler_totient_sieve(100) << endl;
    return 0;
}
