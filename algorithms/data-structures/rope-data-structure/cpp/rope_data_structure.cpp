#include <vector>
#include <iostream>
using namespace std;

struct RopeNode {
    vector<int> data;
    RopeNode *left, *right;
    int weight;
    RopeNode() : left(nullptr), right(nullptr), weight(0) {}
};

RopeNode* buildRope(const vector<int>& arr, int lo, int hi) {
    RopeNode* node = new RopeNode();
    if (hi - lo <= 4) {
        node->data.assign(arr.begin() + lo, arr.begin() + hi);
        node->weight = hi - lo;
        return node;
    }
    int mid = (lo + hi) / 2;
    node->left = buildRope(arr, lo, mid);
    node->right = buildRope(arr, mid, hi);
    node->weight = mid - lo;
    return node;
}

int ropeLength(RopeNode* node) {
    if (!node) return 0;
    if (!node->data.empty()) return (int)node->data.size();
    return node->weight + ropeLength(node->right);
}

RopeNode* concatRope(RopeNode* r1, RopeNode* r2) {
    RopeNode* node = new RopeNode();
    node->left = r1;
    node->right = r2;
    node->weight = ropeLength(r1);
    return node;
}

int indexRope(RopeNode* node, int idx) {
    if (!node->data.empty()) return node->data[idx];
    if (idx < node->weight) return indexRope(node->left, idx);
    return indexRope(node->right, idx - node->weight);
}

int rope_data_structure(const vector<int>& data) {
    int n1 = data[0];
    vector<int> arr1(data.begin() + 1, data.begin() + 1 + n1);
    int pos = 1 + n1;
    int n2 = data[pos];
    vector<int> arr2(data.begin() + pos + 1, data.begin() + pos + 1 + n2);
    int queryIndex = data[pos + 1 + n2];

    RopeNode* r1 = buildRope(arr1, 0, n1);
    RopeNode* r2 = buildRope(arr2, 0, n2);
    RopeNode* combined = concatRope(r1, r2);
    return indexRope(combined, queryIndex);
}

int main() {
    cout << rope_data_structure({3, 1, 2, 3, 2, 4, 5, 0}) << endl;
    cout << rope_data_structure({3, 1, 2, 3, 2, 4, 5, 4}) << endl;
    cout << rope_data_structure({3, 1, 2, 3, 2, 4, 5, 3}) << endl;
    return 0;
}
