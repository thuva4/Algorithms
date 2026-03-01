#include <vector>
using namespace std;

int integer_sqrt(vector<int> arr) {
    long long n = arr[0];
    if (n <= 1) return (int)n;
    long long x = n;
    while (true) {
        long long x1 = (x + n / x) / 2;
        if (x1 >= x) return (int)x;
        x = x1;
    }
}
