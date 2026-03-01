#include "jump_search.h"
#include <math.h>

#define MIN(a,b) (((a)<(b))?(a):(b))

int jump_search(int arr[], int n, int target) {
    if (n == 0) return -1;
    
    int step = sqrt(n);
    int prev = 0;
    
    while (arr[MIN(step, n) - 1] < target) {
        prev = step;
        step += sqrt(n);
        if (prev >= n)
            return -1;
    }
    
    while (arr[prev] < target) {
        prev++;
        if (prev == MIN(step, n))
            return -1;
    }
    
    if (arr[prev] == target)
        return prev;
        
    return -1;
}
