#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

struct ITNode {
    int lo, hi, maxHi;
    ITNode *left, *right;
    ITNode(int l, int h) : lo(l), hi(h), maxHi(h), left(nullptr), right(nullptr) {}
};

ITNode* insert(ITNode* root, int lo, int hi) {
    if (!root) return new ITNode(lo, hi);
    if (lo < root->lo)
        root->left = insert(root->left, lo, hi);
    else
        root->right = insert(root->right, lo, hi);
    root->maxHi = max(root->maxHi, hi);
    return root;
}

int queryCount(ITNode* root, int q) {
    if (!root) return 0;
    int count = 0;
    if (root->lo <= q && q <= root->hi) count = 1;
    if (root->left && root->left->maxHi >= q)
        count += queryCount(root->left, q);
    if (root->lo <= q)
        count += queryCount(root->right, q);
    return count;
}

int interval_tree(const vector<int>& data) {
    int n = data[0];
    ITNode* root = nullptr;
    int idx = 1;
    for (int i = 0; i < n; i++) {
        root = insert(root, data[idx], data[idx + 1]);
        idx += 2;
    }
    int query = data[idx];
    return queryCount(root, query);
}

int main() {
    cout << interval_tree({3, 1, 5, 3, 8, 6, 10, 4}) << endl;
    cout << interval_tree({2, 1, 3, 5, 7, 10}) << endl;
    cout << interval_tree({3, 1, 10, 2, 9, 3, 8, 5}) << endl;
    return 0;
}
