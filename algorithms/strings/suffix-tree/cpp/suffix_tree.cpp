#include <vector>
#include <algorithm>
#include <numeric>

int suffix_tree(std::vector<int> arr) {
    int n = arr.size();
    if (n == 0) return 0;

    std::vector<int> sa(n), rank(arr.begin(), arr.end()), tmp(n);
    std::iota(sa.begin(), sa.end(), 0);
    for (int k = 1; k < n; k *= 2) {
        auto r = rank;
        int step = k;
        std::sort(sa.begin(), sa.end(), [&](int a, int b) {
            if (r[a] != r[b]) return r[a] < r[b];
            int ra = a+step<n ? r[a+step] : -1;
            int rb = b+step<n ? r[b+step] : -1;
            return ra < rb;
        });
        tmp[sa[0]] = 0;
        for (int i = 1; i < n; i++) {
            tmp[sa[i]] = tmp[sa[i-1]];
            if (r[sa[i-1]] != r[sa[i]] ||
                (sa[i-1]+step<n ? r[sa[i-1]+step] : -1) != (sa[i]+step<n ? r[sa[i]+step] : -1))
                tmp[sa[i]]++;
        }
        rank = tmp;
        if (rank[sa[n-1]] == n-1) break;
    }

    std::vector<int> invSa(n), lcp(n, 0);
    for (int i = 0; i < n; i++) invSa[sa[i]] = i;
    int h = 0;
    for (int i = 0; i < n; i++) {
        if (invSa[i] > 0) {
            int j = sa[invSa[i]-1];
            while (i+h < n && j+h < n && arr[i+h] == arr[j+h]) h++;
            lcp[invSa[i]] = h;
            if (h > 0) h--;
        } else { h = 0; }
    }

    long long total = (long long)n * (n+1) / 2;
    for (int v : lcp) total -= v;
    return (int)total;
}
