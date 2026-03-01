#include <vector>
#include <set>
#include <iostream>
#include <algorithm>
using namespace std;

int cuckoo_hashing(const vector<int>& data) {
    int n = data[0];
    if (n == 0) return 0;

    int capacity = max(2 * n, 11);
    vector<int> table1(capacity, -1);
    vector<int> table2(capacity, -1);
    set<int> inserted;

    auto h1 = [&](int key) { return ((key % capacity) + capacity) % capacity; };
    auto h2 = [&](int key) { return (((key / capacity) + 1) % capacity + capacity) % capacity; };

    for (int i = 1; i <= n; i++) {
        int key = data[i];
        if (inserted.count(key)) continue;

        if (table1[h1(key)] == key || table2[h2(key)] == key) {
            inserted.insert(key);
            continue;
        }

        int current = key;
        bool success = false;
        for (int iter = 0; iter < 2 * capacity; iter++) {
            int pos1 = h1(current);
            if (table1[pos1] == -1) {
                table1[pos1] = current;
                success = true;
                break;
            }
            swap(current, table1[pos1]);

            int pos2 = h2(current);
            if (table2[pos2] == -1) {
                table2[pos2] = current;
                success = true;
                break;
            }
            swap(current, table2[pos2]);
        }
        if (success) inserted.insert(key);
    }
    return (int)inserted.size();
}

int main() {
    cout << cuckoo_hashing({3, 10, 20, 30}) << endl;
    cout << cuckoo_hashing({4, 5, 5, 5, 5}) << endl;
    cout << cuckoo_hashing({5, 1, 2, 3, 4, 5}) << endl;
    return 0;
}
