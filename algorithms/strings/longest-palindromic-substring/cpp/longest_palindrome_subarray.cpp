#include <vector>
#include <algorithm>
using namespace std;

static int expand(const vector<int>& arr, int l, int r) {
    int n = (int)arr.size();
    while (l >= 0 && r < n && arr[l] == arr[r]) {
        l--;
        r++;
    }
    return r - l - 1;
}

int longest_palindrome_subarray(vector<int> arr) {
    int n = (int)arr.size();
    if (n == 0) return 0;

    int maxLen = 1;
    for (int i = 0; i < n; i++) {
        int odd = expand(arr, i, i);
        int even = expand(arr, i, i + 1);
        maxLen = max(maxLen, max(odd, even));
    }
    return maxLen;
}
