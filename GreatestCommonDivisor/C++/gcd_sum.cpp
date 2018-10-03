#include <bits/stdc++.h>
using namespace std;


//Given a number N, find sum of all GCDs that can be formed by selecting all the pairs from 1 to N.

const int N = 12;
int phi[N + 1];
int prime[N + 1];
long long G[N + 1];

int main() {
    // Compute phi[n]
    for (int p = 1; p <= N; ++ p) phi[p] = p;
    for (int p = 2; p <= N; ++ p)
        if (phi[p] == p)
           for (int n = p; n <= N; n += p)
               phi[n] = phi[n]/p*(p-1);

    // Compute prime[n] -> Largest prime that divides n
    for (int p = 1; p <= N; ++ p) prime[p] = 0;
    for (int p = 2; p <= N; ++ p)
        if (prime[p] == 0)
           for (int n = p; n <= N; n += p) prime[n] = max(prime[n], p);

    G[1] = 1;
    for (int n = 2; n <= N; ++ n) {
        int p = 1;
        int k = 0;
        while (p <= n/prime[n] && n % (p * prime[n]) == 0) {
              p *= prime[n];
              ++ k;
        }
        G[n] = ((k+1)*p - k*p/prime[n]) * G[n/p];
    }

    G[1] = G[1] - 1;
    for (int n = 2; n <= N; ++ n) G[n] += G[n-1] - n;
    cout << G[N] << endl;
}


