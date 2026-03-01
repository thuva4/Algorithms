#include <stdio.h>

int HammingDistance(int a, int b) {
    unsigned int value = (unsigned int)(a ^ b);
    int distance = 0;
    while (value != 0U) {
        distance += (int)(value & 1U);
        value >>= 1U;
    }
    return distance;
}

int hamming_distance(int a, int b) {
    return HammingDistance(a, b);
}

int main(void) {
    printf("%d\n", HammingDistance(1, 4));
    return 0;
}
