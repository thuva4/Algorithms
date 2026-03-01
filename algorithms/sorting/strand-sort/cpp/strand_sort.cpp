#include "strand_sort.h"
#include <list>
#include <vector>

void strand_sort(std::vector<int>& arr) {
    if (arr.empty()) return;

    std::list<int> lst(arr.begin(), arr.end());
    std::list<int> sorted;

    while (!lst.empty()) {
        std::list<int> strand;
        strand.push_back(lst.front());
        lst.pop_front();

        for (auto it = lst.begin(); it != lst.end(); ) {
            if (*it >= strand.back()) {
                strand.push_back(*it);
                it = lst.erase(it);
            } else {
                ++it;
            }
        }
        sorted.merge(strand);
    }

    int i = 0;
    for (int x : sorted) {
        arr[i++] = x;
    }
}
