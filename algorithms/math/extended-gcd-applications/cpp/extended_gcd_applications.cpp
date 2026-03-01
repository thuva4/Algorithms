#include <iostream>
#include <vector>
#include <tuple>
using namespace std;

tuple<long long, long long, long long> extGcd(long long a, long long b) {
    if (a == 0) return {b, 0, 1};
    auto [g, x1, y1] = extGcd(b % a, a);
    return {g, y1 - (b/a)*x1, x1};
}

int extendedGcdApplications(const vector<int>& arr) {
    long long a = arr[0], m = arr[1];
    auto [g, x, y] = extGcd(((a%m)+m)%m, m);
    if (g != 1) return -1;
    return (int)(((x%m)+m)%m);
}

int main() {
    cout << extendedGcdApplications({3, 7}) << endl;
    cout << extendedGcdApplications({1, 13}) << endl;
    cout << extendedGcdApplications({6, 9}) << endl;
    cout << extendedGcdApplications({2, 11}) << endl;
    return 0;
}
