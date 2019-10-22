/* Author : Aaryan Srivastava (aaryans941)*/ 
#include <bits/stdc++.h>
#define ff first
#define ss second 
#define all(c) (c).begin(),(c).end()
const int Wmax = 1e5 +5 ;
const int Nmax = 1e2 +5 ; 
using namespace std; 
using cd = complex<double>;
const double PI = acos(-1);

void fft(vector<cd> & a, bool invert) {
    int n = a.size();

    for (int i = 1, j = 0; i < n; i++) { 
        // reordering elements. 
        int bit = n >> 1;
        for (; j & bit; bit >>= 1)
            j ^= bit;
        j ^= bit;

        if (i < j)
            swap(a[i], a[j]);
    }

    for (int len = 2; len <= n; len <<= 1) { // length of segment 
        double ang = 2 * PI / len * (invert ? -1 : 1);
        cd wlen(cos(ang), sin(ang));
        for (int i = 0; i < n; i += len) { // starting point 
            cd w(1);
            for (int j = 0; j < len / 2; j++) { // performing operations in [i , i + len) 
                cd u = a[i+j], v = a[i+j+len/2] * w;
                a[i+j] = u + v;
                a[i+j+len/2] = u - v;
                w *= wlen;
            }
        }
    }

    if (invert) {
        for (cd & x : a)
            x /= n; // dividing each element by n , in case of inversion 
    }
}


int main()
{
    cout << std::fixed << std::setprecision(6) ;
    int x , n = 1;
    cin >> x; // x - 1 would be order of the polynomial.
    while(n < x) n <<= 1; 
    vector<cd> a; 
    for(int i = 0 ; i < x ; ++i){
        double real , imag;
        cin >> real >> imag ;
        cd tmp(real , imag); 
        a.push_back(tmp);
    }

    a.resize(n) ; // appending zeros to make degree-bound a power of 2. 
    
    fft(a , false); //performing FFT
    for (int i = 0; i < n; ++i) // Discrete fourier transform of the input polynomial
        cout << a[i].real() << " " << a[i].imag() << endl;


    fft(a , true); // inverting back to original coefficients 
    for (int i = 0; i < n; ++i)
        cout << a[i].real() << " " << a[i].imag() << endl;

}   
