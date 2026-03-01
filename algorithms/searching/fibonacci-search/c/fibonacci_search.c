#include "fibonacci_search.h"

#define MIN(a,b) (((a)<(b))?(a):(b))

int fibonacci_search(int arr[], int n, int target) {
    if (n == 0) return -1;
    
    int fibMMm2 = 0; // (m-2)'th Fibonacci No.
    int fibMMm1 = 1; // (m-1)'th Fibonacci No.
    int fibM = fibMMm2 + fibMMm1; // m'th Fibonacci
    
    while (fibM < n) {
        fibMMm2 = fibMMm1;
        fibMMm1 = fibM;
        fibM = fibMMm2 + fibMMm1;
    }
    
    int offset = -1;
    
    while (fibM > 1) {
        int i = MIN(offset + fibMMm2, n - 1);
        
        if (arr[i] < target) {
            fibM = fibMMm1;
            fibMMm1 = fibMMm2;
            fibMMm2 = fibM - fibMMm1;
            offset = i;
        } else if (arr[i] > target) {
            fibM = fibMMm2;
            fibMMm1 = fibMMm1 - fibMMm2;
            fibMMm2 = fibM - fibMMm1;
        } else {
            return i;
        }
    }
    
    if (fibMMm1 && offset + 1 < n && arr[offset + 1] == target)
        return offset + 1;
        
    return -1;
}
