#include <iostream>
#include <vector>
using namespace std;

/**
 * Determine if target can be formed by summing elements from arr
 * with repetition allowed.
 *
 * arr: vector of positive integers (available elements)
 * target: the target sum to reach
 * Returns: 1 if target is achievable, 0 otherwise
 */
int canSum(const vector<int>& arr, int target) {
    if (target == 0) return 1;

    vector<bool> dp(target + 1, false);
    dp[0] = true;

    for (int i = 1; i <= target; i++) {
        for (int elem : arr) {
            if (elem <= i && dp[i - elem]) {
                dp[i] = true;
                break;
            }
        }
    }

    return dp[target] ? 1 : 0;
}

int main() {
    cout << canSum({2, 3}, 7) << endl;   // 1
    cout << canSum({5, 3}, 8) << endl;   // 1
    cout << canSum({2, 4}, 7) << endl;   // 0
    cout << canSum({1}, 5) << endl;      // 1
    cout << canSum({7}, 3) << endl;      // 0
    return 0;
}
