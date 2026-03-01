#include <vector>
#include <cmath>
#include <string>

using namespace std;

static long long multiply(long long x, long long y) {
    if (x < 10 || y < 10) return x * y;

    int n = max(to_string(abs(x)).length(), to_string(abs(y)).length());
    int half = n / 2;
    long long power = (long long)pow(10, half);

    long long x1 = x / power, x0 = x % power;
    long long y1 = y / power, y0 = y % power;

    long long z0 = multiply(x0, y0);
    long long z2 = multiply(x1, y1);
    long long z1 = multiply(x0 + x1, y0 + y1) - z0 - z2;

    return z2 * power * power + z1 * power + z0;
}

int karatsuba(vector<int> arr) {
    return (int)multiply(arr[0], arr[1]);
}
