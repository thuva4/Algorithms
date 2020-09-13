#include <stdio.h>
#include <stdbool.h>

bool isPrimeNumber(int n)
{
    if (n <= 3)
    {
        return(n > 1);
    }
    else if (n % 2 == 0 || n % 3 == 0)
    {
        return(false);
    }

    int i = 5;

    while (i * i <= n)
    {
        if (n % i == 0 || n % (i + 2) == 0)
        {
            return(false);
        }
        i += 6;
    }

    return(true);
}

int main()
{
    printf("%i\n", isPrimeNumber(11));
    printf("%i\n", isPrimeNumber(12));
    printf("%i\n", isPrimeNumber(13));
    printf("%i\n", isPrimeNumber(15));
    printf("%i\n", isPrimeNumber(17));
    printf("%i\n", isPrimeNumber(19));
    return(0);
}
