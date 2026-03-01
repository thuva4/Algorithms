#include <iostream>

int hamming_distance(int a, int b) {
    int value = a ^ b;
    int distance = 0;

    while (value != 0) {
        distance += value & 1;
        value >>= 1;
    }

    return distance;
}

int main() {
    int a = 0;
    int b = 0;
    std::cin >> a >> b;
    std::cout << hamming_distance(a, b) << std::endl;
    return 0;
}
