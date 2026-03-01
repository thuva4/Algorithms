#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int lz77Compression(const vector<int>& arr) {
    int n = arr.size(), count = 0, i = 0;
    while (i < n) {
        int bestLen = 0, start = max(0, i - 256);
        for (int j = start; j < i; j++) {
            int len = 0, dist = i - j;
            while (i+len < n && len < dist && arr[j+len] == arr[i+len]) len++;
            if (len == dist) while (i+len < n && arr[j+(len%dist)] == arr[i+len]) len++;
            if (len > bestLen) bestLen = len;
        }
        if (bestLen >= 2) { count++; i += bestLen; } else i++;
    }
    return count;
}

int main() {
    cout << lz77Compression({1,2,3,1,2,3}) << endl;
    cout << lz77Compression({5,5,5,5}) << endl;
    cout << lz77Compression({1,2,3,4}) << endl;
    cout << lz77Compression({1,2,1,2,3,4,3,4}) << endl;
    return 0;
}
