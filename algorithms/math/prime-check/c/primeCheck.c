#include <stdio.h>
#include <stdbool.h>
#include <assert.h>

bool isPrimeNumber(int n)
{
    if (n <= 3)
    {
        return (n > 1);
    }
    else if (n % 2 == 0 || n % 3 == 0)
    {
        return (false);
    }

    int i = 5;

    while (i * i <= n)
    {
        if (n % i == 0 || n % (i + 2) == 0)
        {
            return (false);
        }
        i += 6;
    }

    return (true);
}

int main()
{
    assert(isPrimeNumber(11));
    assert(!isPrimeNumber(12));
    assert(isPrimeNumber(13));
    assert(!isPrimeNumber(15));
    assert(isPrimeNumber(17));
    assert(isPrimeNumber(19));
    return (0);
}
