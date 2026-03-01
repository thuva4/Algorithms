#include <vector>
using namespace std;

int can_partition(vector<int> arr) {
    int total = 0;
    for (int x : arr) total += x;
    if (total % 2 != 0) return 0;
    int target = total / 2;
    vector<bool> dp(target + 1, false);
    dp[0] = true;
    for (int num : arr) {
        for (int j = target; j >= num; j--) {
            dp[j] = dp[j] || dp[j - num];
        }
    }
    return dp[target] ? 1 : 0;
}
