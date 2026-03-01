#include <iostream>
#include <vector>
using namespace std;

int wildcardMatching(const vector<int>& arr) {
    int idx = 0;
    int tlen = arr[idx++];
    vector<int> text(arr.begin()+idx, arr.begin()+idx+tlen); idx += tlen;
    int plen = arr[idx++];
    vector<int> pattern(arr.begin()+idx, arr.begin()+idx+plen);

    vector<vector<bool>> dp(tlen+1, vector<bool>(plen+1, false));
    dp[0][0] = true;
    for (int j = 1; j <= plen; j++)
        if (pattern[j-1] == 0) dp[0][j] = dp[0][j-1];

    for (int i = 1; i <= tlen; i++)
        for (int j = 1; j <= plen; j++) {
            if (pattern[j-1] == 0) dp[i][j] = dp[i-1][j] || dp[i][j-1];
            else if (pattern[j-1] == -1 || pattern[j-1] == text[i-1]) dp[i][j] = dp[i-1][j-1];
        }

    return dp[tlen][plen] ? 1 : 0;
}

int main() {
    cout << wildcardMatching({3, 1, 2, 3, 3, 1, 2, 3}) << endl;
    cout << wildcardMatching({3, 1, 2, 3, 1, 0}) << endl;
    cout << wildcardMatching({3, 1, 2, 3, 3, 1, -1, 3}) << endl;
    cout << wildcardMatching({2, 1, 2, 2, 3, 4}) << endl;
    cout << wildcardMatching({0, 1, 0}) << endl;
    return 0;
}
