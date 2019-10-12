
#include <bits/stdc++.h>
using namespace std;

//This code will compute all the prime numbers
// that are smaller than or equal to N.
//beginning of Sieve function
void sieve(int N) {
        bool isPrime[N+1];

	//Initialising all the array elements with 'true'
	
        for(int i = 0; i <= N;++i) {
            isPrime[i] = true;
        }

	//since 0 and 1 are non-prime numbers.
        isPrime[0] = false;
        isPrime[1] = false;

	
        for(int i = 2; i * i <= N; ++i) {
             if(isPrime[i] == true) {                    //Mark all the multiples of i as composite numbers
                 for(int j = i * i; j <= N ;j += i)
                     isPrime[j] = false;
            }
        }
    }
//closing of function
