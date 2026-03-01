
#include <bits/stdc++.h>
using namespace std;

//This code will compute all the prime numbers
// that are smaller than or equal to N.

void sieve(int N) {
        bool isPrime[N+1];
        for(int i = 0; i <= N;++i) {
            isPrime[i] = true;
        }
        isPrime[0] = false;
        isPrime[1] = false;
        for(int i = 2; i * i <= N; ++i) {
             if(isPrime[i] == true) {                    //Mark all the multiples of i as composite numbers
                 for(int j = i * i; j <= N ;j += i)
                     isPrime[j] = false;
            }
        }
    }
#include <vector>

std::vector<int> sieve_of_eratosthenes(int n) {
    if (n < 2) {
        return {};
    }

    std::vector<bool> is_prime(n + 1, true);
    is_prime[0] = false;
    is_prime[1] = false;
    for (int value = 2; value * value <= n; ++value) {
        if (!is_prime[value]) {
            continue;
        }
        for (int multiple = value * value; multiple <= n; multiple += value) {
            is_prime[multiple] = false;
        }
    }

    std::vector<int> primes;
    for (int value = 2; value <= n; ++value) {
        if (is_prime[value]) {
            primes.push_back(value);
        }
    }
    return primes;
}
