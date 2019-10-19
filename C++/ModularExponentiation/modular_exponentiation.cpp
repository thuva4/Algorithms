#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <sstream>
#include <queue>
#include <deque>
#include <bitset>
#include <iterator>
#include <list>
#include <stack>
#include <map>
#include <unordered_map>
#include <set>
#include <functional>
#include <numeric>
#include <utility>
#include <limits>
#include <time.h>
#include <math.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <assert.h>
using namespace std;
#define lld long long int
const lld mod = 1e9+7;  //The default mod value, we can use any mod value we want

// (a*b)%mod = (a%mod * b%mod)%mod

lld modular_expo(lld a, lld b)
{
    lld res = 1;
    a = a%mod;
    while(b > 0)
    {
        if (b&1)    //This checks if the power is odd or not
        {
            res = (res%mod*a%mod)%mod;
        }
        b = b>>1;  //This is just b = b/2
        a = (a%mod * a%mod);
    }
    return res;
}
int main()
{
    int n,p;
    cin>>n>>p;
    lld result = modular_expo(n, p);
    cout<<result<<"\n";
}