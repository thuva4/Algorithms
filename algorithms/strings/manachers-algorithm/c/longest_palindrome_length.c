#include "longest_palindrome_length.h"

#define MAX_N 10000

static int t[MAX_N];
static int p[MAX_N];

int longest_palindrome_length(int arr[], int n) {
    if (n == 0) return 0;

    int tn = 2 * n + 1;
    for (int i = 0; i < tn; i++) {
        t[i] = (i % 2 == 0) ? -1 : arr[i / 2];
    }

    int c = 0, r = 0, max_len = 0;
    for (int i = 0; i < tn; i++) {
        p[i] = 0;
        int mirror = 2 * c - i;
        if (i < r) {
            p[i] = r - i < p[mirror] ? r - i : p[mirror];
        }
        while (i + p[i] + 1 < tn && i - p[i] - 1 >= 0 && t[i + p[i] + 1] == t[i - p[i] - 1]) {
            p[i]++;
        }
        if (i + p[i] > r) { c = i; r = i + p[i]; }
        if (p[i] > max_len) max_len = p[i];
    }

    return max_len;
}
