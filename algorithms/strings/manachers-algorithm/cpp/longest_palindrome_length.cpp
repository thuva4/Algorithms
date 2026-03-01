#include <vector>
#include <algorithm>
using namespace std;

int longest_palindrome_length(vector<int> arr) {
    if (arr.empty()) return 0;

    vector<int> t;
    t.push_back(-1);
    for (int x : arr) {
        t.push_back(x);
        t.push_back(-1);
    }

    int n = (int)t.size();
    vector<int> p(n, 0);
    int c = 0, r = 0, maxLen = 0;

    for (int i = 0; i < n; i++) {
        int mirror = 2 * c - i;
        if (i < r) p[i] = min(r - i, p[mirror]);
        while (i + p[i] + 1 < n && i - p[i] - 1 >= 0 && t[i + p[i] + 1] == t[i - p[i] - 1]) {
            p[i]++;
        }
        if (i + p[i] > r) { c = i; r = i + p[i]; }
        if (p[i] > maxLen) maxLen = p[i];
    }

    return maxLen;
}
