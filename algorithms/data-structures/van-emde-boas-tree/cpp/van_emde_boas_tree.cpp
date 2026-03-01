#include <vector>
#include <cmath>
#include <iostream>
using namespace std;

class VEB {
    int u, minVal, maxVal, sqrtU;
    vector<VEB*> cluster;
    VEB* summary;

    int high(int x) { return x / sqrtU; }
    int low(int x) { return x % sqrtU; }
    int idx(int h, int l) { return h * sqrtU + l; }

public:
    VEB(int u) : u(u), minVal(-1), maxVal(-1), sqrtU(0), summary(nullptr) {
        if (u > 2) {
            sqrtU = (int)ceil(sqrt((double)u));
            cluster.resize(sqrtU);
            for (int i = 0; i < sqrtU; i++) cluster[i] = new VEB(sqrtU);
            summary = new VEB(sqrtU);
        }
    }

    ~VEB() {
        for (auto c : cluster) delete c;
        delete summary;
    }

    void insert(int x) {
        if (minVal == -1) { minVal = maxVal = x; return; }
        if (x < minVal) swap(x, minVal);
        if (u > 2) {
            int h = high(x), l = low(x);
            if (cluster[h]->minVal == -1) summary->insert(h);
            cluster[h]->insert(l);
        }
        if (x > maxVal) maxVal = x;
    }

    bool member(int x) {
        if (x == minVal || x == maxVal) return true;
        if (u <= 2) return false;
        return cluster[high(x)]->member(low(x));
    }

    int successor(int x) {
        if (u <= 2) {
            if (x == 0 && maxVal == 1) return 1;
            return -1;
        }
        if (minVal != -1 && x < minVal) return minVal;
        int h = high(x), l = low(x);
        int maxC = cluster[h]->maxVal;
        if (cluster[h]->minVal != -1 && l < maxC) {
            return idx(h, cluster[h]->successor(l));
        }
        int sc = summary->successor(h);
        if (sc == -1) return -1;
        return idx(sc, cluster[sc]->minVal);
    }
};

vector<int> van_emde_boas_tree(const vector<int>& data) {
    int u = data[0], nOps = data[1];
    VEB veb(u);
    vector<int> results;
    int i = 2;
    for (int k = 0; k < nOps; k++) {
        int op = data[i], val = data[i + 1];
        i += 2;
        if (op == 1) veb.insert(val);
        else if (op == 2) results.push_back(veb.member(val) ? 1 : 0);
        else results.push_back(veb.successor(val));
    }
    return results;
}

int main() {
    auto r = van_emde_boas_tree({16, 4, 1, 3, 1, 5, 2, 3, 2, 7});
    for (int v : r) cout << v << " ";
    cout << endl;
    return 0;
}
