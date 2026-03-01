#include <stdio.h>

int Fibonacci(int num) {
    if (num <= 0) {
        return 0;
    }
    if (num == 1) {
        return 1;
    }

    int prev = 0;
    int curr = 1;
    for (int i = 2; i <= num; i++) {
        int next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr;
}

int fibonacci(int num) {
    return Fibonacci(num);
}

int main(void) {
    printf("%d\n", Fibonacci(10));
    return 0;
}
