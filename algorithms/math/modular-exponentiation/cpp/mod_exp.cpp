#include <vector>
using namespace std;

int mod_exp(vector<int> arr) {
    long long base = arr[0];
    long long exp = arr[1];
    long long mod = arr[2];
    if (mod == 1) return 0;
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = (result * base) % mod;
        exp >>= 1;
        base = (base * base) % mod;
    }
    return (int)result;
}
