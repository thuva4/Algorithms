#include <vector>
#include <cmath>
#include <iostream>
using namespace std;

struct FibNode {
    int key, degree;
    FibNode *parent, *child, *left, *right;
    bool mark;
    FibNode(int k) : key(k), degree(0), parent(nullptr), child(nullptr),
                     left(this), right(this), mark(false) {}
};

class FibHeap {
    FibNode* minNode;
    int n;

    void addToRootList(FibNode* node) {
        node->left = minNode;
        node->right = minNode->right;
        minNode->right->left = node;
        minNode->right = node;
    }

    void removeFromList(FibNode* node) {
        node->left->right = node->right;
        node->right->left = node->left;
    }

    vector<FibNode*> getSiblings(FibNode* node) {
        vector<FibNode*> sibs;
        FibNode* curr = node;
        do {
            sibs.push_back(curr);
            curr = curr->right;
        } while (curr != node);
        return sibs;
    }

    void link(FibNode* y, FibNode* x) {
        removeFromList(y);
        y->left = y;
        y->right = y;
        if (x->child == nullptr) {
            x->child = y;
        } else {
            y->left = x->child;
            y->right = x->child->right;
            x->child->right->left = y;
            x->child->right = y;
        }
        y->parent = x;
        x->degree++;
        y->mark = false;
    }

    void consolidate() {
        int maxDeg = (int)(log2(n)) + 2;
        vector<FibNode*> A(maxDeg + 1, nullptr);
        vector<FibNode*> roots = getSiblings(minNode);
        for (FibNode* w : roots) {
            FibNode* x = w;
            int d = x->degree;
            while (d < (int)A.size() && A[d] != nullptr) {
                FibNode* y = A[d];
                if (x->key > y->key) swap(x, y);
                link(y, x);
                A[d] = nullptr;
                d++;
            }
            if (d >= (int)A.size()) A.resize(d + 1, nullptr);
            A[d] = x;
        }
        minNode = nullptr;
        for (FibNode* node : A) {
            if (node != nullptr) {
                node->left = node;
                node->right = node;
                if (minNode == nullptr) {
                    minNode = node;
                } else {
                    addToRootList(node);
                    if (node->key < minNode->key) minNode = node;
                }
            }
        }
    }

public:
    FibHeap() : minNode(nullptr), n(0) {}

    void insert(int key) {
        FibNode* node = new FibNode(key);
        if (minNode == nullptr) {
            minNode = node;
        } else {
            addToRootList(node);
            if (node->key < minNode->key) minNode = node;
        }
        n++;
    }

    int extractMin() {
        FibNode* z = minNode;
        if (z == nullptr) return -1;
        if (z->child != nullptr) {
            vector<FibNode*> children = getSiblings(z->child);
            for (FibNode* c : children) {
                addToRootList(c);
                c->parent = nullptr;
            }
        }
        removeFromList(z);
        if (z == z->right) {
            minNode = nullptr;
        } else {
            minNode = z->right;
            consolidate();
        }
        n--;
        int result = z->key;
        delete z;
        return result;
    }
};

vector<int> fibonacci_heap(const vector<int>& operations) {
    FibHeap heap;
    vector<int> results;
    for (int op : operations) {
        if (op == 0) {
            results.push_back(heap.extractMin());
        } else {
            heap.insert(op);
        }
    }
    return results;
}

int main() {
    vector<int> ops = {3, 1, 4, 0, 0};
    vector<int> res = fibonacci_heap(ops);
    for (int v : res) cout << v << " ";
    cout << endl;
    return 0;
}
