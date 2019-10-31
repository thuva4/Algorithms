#include <iostream>

using namespace std;

long long fact(int);

int main()
{
    int n;
    long long result;
    char option;

    while(1)
    {
        cout << "Enter an integer 'n' to find its factorial. ie, n x (n-1) x (n-2) x ... x 2 x 1\n";
        cin >> n;

        if(n < 0)
        {
            cout << "Sorry you cannot calculate is not defined";
        }
        else
        {
            result = fact(n);
            cout << result;
        }

        cout << "\nDo you want to do it again? Press Y or N: ";
        cin >> option;

        if(option == 'N' || option == 'n')
            break;

    }

    return 0;
}

long long fact(int n)
{
    if(n == 0)
        return 1;

    return n * fact(n - 1);
}
