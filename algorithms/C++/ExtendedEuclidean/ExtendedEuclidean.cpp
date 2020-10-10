#include <iostream>

using namespace std;

int gcdExtended(int a, int b, int* x, int* y)
{
    // Base Condition (Special Case)
    if (a == 0) {
        *x = 0;
        *y = 1;
        return b;
    }

    // Call the function recursively
    int x1, y1;  
    int gcd = gcdExtended(b % a, a, &x1, &y1);

    // Update x1 and y1 using results of recursive call
    *x = y1 - (b / a) * x1;
    *y = x1;

    return gcd;
}

int main()
{
    int x, y, a = 60, b = 15;
    int g = gcdExtended(a, b, &x, &y);
    
    // Test the function
    cout << "gcd(" << a << ", " << b << ") = " << g << endl;
    
    return 0;
}
