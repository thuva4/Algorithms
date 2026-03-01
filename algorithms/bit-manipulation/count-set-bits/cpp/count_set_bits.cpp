#include <vector>
using namespace std;

int count_set_bits(vector<int> arr) {
    int total = 0;
    for (int num : arr) {
        while (num) {
            total++;
            num &= (num - 1);
        }
    }
    return total;
}
