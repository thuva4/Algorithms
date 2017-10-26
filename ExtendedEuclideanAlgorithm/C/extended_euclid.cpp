int d, x, y;

void Extended_Euclid(int A, int B)   // a given equation of form Ax+By, extended euclid finds the gcd of A and B as well as the co-efficients of A and B
{
    if(B == 0)
    {
        d = A;
        x = 1;
        y = 0;
    }
    else
    {
        Extended_Euclid(B, A%B);
        int temp = x;
        x = y;
        y = temp - (A/B)*y;
    }
}

int main( )
{
    int m,n;
    cin>>m>>n;
extendedEuclid(m, n);
cout << "The GCD of m and n is " << d << endl;
cout << "Coefficient x and y are: "<< x <<  "and  " << y << endl;
return 0;
}
