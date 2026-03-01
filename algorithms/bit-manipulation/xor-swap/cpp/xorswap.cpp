#include <vector>

std::vector<int> xor_swap(int a, int b) {
    if (a != b) {
        a ^= b;
        b ^= a;
        a ^= b;
    }
    return {a, b};
}
