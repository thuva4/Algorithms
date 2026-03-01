#include <iostream>
#include <assert.h>

using namespace std;

int gcdExtended(int a, int b, int* x, int* y)
{
    // Base Condition (Special Case)
    if (a == 0) {
        *x = 0;
        *y = 1;
        return b;
    }

    // Call the function recursively
    int x1, y1;
    int gcd = gcdExtended(b % a, a, &x1, &y1);

    // Update x1 and y1 using results of recursive call
    *x = y1 - (b / a) * x1;
    *y = x1;

    return gcd;
}

int main()
{
    int x, y, a = 60, b = 15;
    int g = gcdExtended(a, b, &x, &y);

    assert(g == 15);

    // Test the function
    cout << "gcd(" << a << ", " << b << ") = " << g << endl;

    return 0;
}
#include <vector>

std::vector<int> extended_gcd(int a, int b) {
    if (a == 0) {
        return {b, 0, 1};
    }
    if (b == 0) {
        return {a, 1, 0};
    }
    if (a == b) {
        return {a, 1, 0};
    }

    std::vector<int> next = extended_gcd(b, a % b);
    int gcd = next[0];
    int x = next[2];
    int y = next[1] - (a / b) * next[2];
    return {gcd, x, y};
}
