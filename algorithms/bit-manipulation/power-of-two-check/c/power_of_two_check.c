#include "power_of_two_check.h"

int power_of_two_check(int n) {
    if (n <= 0) return 0;
    return (n & (n - 1)) == 0 ? 1 : 0;
}
