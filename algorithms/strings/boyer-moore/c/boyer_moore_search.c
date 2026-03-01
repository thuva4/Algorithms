#include "boyer_moore_search.h"

#define MAX_VAL 100001
static int bad_char_table[MAX_VAL * 2];

int boyer_moore_search(int arr[], int size) {
    int text_len = arr[0];
    int pat_len = arr[1 + text_len];
    int *text = &arr[1];
    int *pattern = &arr[2 + text_len];

    if (pat_len == 0) return 0;
    if (pat_len > text_len) return -1;

    /* Simple approach: scan pattern for bad character on each mismatch */
    int s = 0;
    while (s <= text_len - pat_len) {
        int j = pat_len - 1;
        while (j >= 0 && pattern[j] == text[s + j]) j--;
        if (j < 0) return s;

        int bc = -1;
        int mismatch_val = text[s + j];
        for (int k = j - 1; k >= 0; k--) {
            if (pattern[k] == mismatch_val) {
                bc = k;
                break;
            }
        }
        int shift = j - bc;
        if (shift < 1) shift = 1;
        s += shift;
    }

    return -1;
}
