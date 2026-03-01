#include <vector>
#include <algorithm>
#include <numeric>

std::vector<int> suffix_array(std::vector<int> arr) {
    int n = arr.size();
    if (n == 0) return {};
    std::vector<int> sa(n), rank(arr.begin(), arr.end()), tmp(n);
    std::iota(sa.begin(), sa.end(), 0);
    for (int k = 1; k < n; k *= 2) {
        auto cmp = [&](int a, int b) {
            if (rank[a] != rank[b]) return rank[a] < rank[b];
            int ra = a + k < n ? rank[a + k] : -1;
            int rb = b + k < n ? rank[b + k] : -1;
            return ra < rb;
        };
        std::sort(sa.begin(), sa.end(), cmp);
        tmp[sa[0]] = 0;
        for (int i = 1; i < n; i++) {
            tmp[sa[i]] = tmp[sa[i - 1]];
            if (cmp(sa[i - 1], sa[i])) tmp[sa[i]]++;
        }
        rank = tmp;
        if (rank[sa[n - 1]] == n - 1) break;
    }
    return sa;
}
