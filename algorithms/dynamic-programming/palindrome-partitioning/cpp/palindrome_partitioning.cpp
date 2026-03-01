#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int palindromePartitioning(const vector<int>& arr) {
    int n = arr.size();
    if (n <= 1) return 0;

    vector<vector<bool>> isPal(n, vector<bool>(n, false));
    for (int i = 0; i < n; i++) isPal[i][i] = true;
    for (int i = 0; i < n - 1; i++) isPal[i][i+1] = (arr[i] == arr[i+1]);
    for (int len = 3; len <= n; len++)
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            isPal[i][j] = (arr[i] == arr[j]) && isPal[i+1][j-1];
        }

    vector<int> cuts(n);
    for (int i = 0; i < n; i++) {
        if (isPal[0][i]) { cuts[i] = 0; continue; }
        cuts[i] = i;
        for (int j = 1; j <= i; j++)
            if (isPal[j][i]) cuts[i] = min(cuts[i], cuts[j-1] + 1);
    }
    return cuts[n-1];
}

int main() {
    cout << palindromePartitioning({1, 2, 1}) << endl;
    cout << palindromePartitioning({1, 2, 3, 2}) << endl;
    cout << palindromePartitioning({1, 2, 3}) << endl;
    cout << palindromePartitioning({5}) << endl;
    return 0;
}
