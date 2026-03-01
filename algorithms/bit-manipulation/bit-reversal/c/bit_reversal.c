#include "bit_reversal.h"
#include <stdint.h>

long long bit_reversal(long long n) {
    uint32_t val = (uint32_t)n;
    uint32_t result = 0;
    for (int i = 0; i < 32; i++) {
        result = (result << 1) | (val & 1);
        val >>= 1;
    }
    return (long long)result;
}
