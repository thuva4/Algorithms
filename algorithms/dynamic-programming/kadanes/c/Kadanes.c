#include <limits.h>

int KadaneAlgo(int ar[], int size) {
    if (size <= 0) {
        return 0;
    }

    int maximum = ar[0];
    int current = ar[0];
    for (int i = 1; i < size; i++) {
        current = (current + ar[i] > ar[i]) ? current + ar[i] : ar[i];
        maximum = (maximum > current) ? maximum : current;
    }
    return maximum;
}

int kadane(int ar[], int size) {
    return KadaneAlgo(ar, size);
}
