#include <vector>
#include <set>
#include <algorithm>
using namespace std;

int planarity_testing(vector<int> arr) {
    int n = arr[0], m = arr[1];
    set<pair<int,int>> edges;
    for (int i = 0; i < m; i++) {
        int u = arr[2+2*i], v = arr[2+2*i+1];
        if (u != v) edges.insert({min(u,v), max(u,v)});
    }
    int e = (int)edges.size();
    if (n < 3) return 1;
    return e <= 3 * n - 6 ? 1 : 0;
}
