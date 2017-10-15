/*
* @author Abhishek Datta
* @github_id abdatta
* @since 15th October, 2017
*
* The following algroithm takes complex coeeficients
* and calculates its inverse discrete fourier transform
*/

#include <complex>
#include <iostream>
#include <iomanip>
#include <valarray>
 
const double PI = std::acos(-1);
 
typedef std::complex<double> Complex;
typedef std::valarray<Complex> CArray;

// recursive fft (in-place)
void fft(CArray& x)
{
    const size_t N = x.size();
    if (N <= 1) return;
 
    // divide
    CArray even = x[std::slice(0, N/2, 2)];
    CArray  odd = x[std::slice(1, N/2, 2)];
 
    // conquer
    fft(even);
    fft(odd);
 
    // combine
    for (size_t k = 0; k < N/2; ++k)
    {
        Complex t = std::polar(1.0, 2 * PI * k / N) * odd[k];
        x[k    ] = even[k] + t;
        x[k+N/2] = even[k] - t;
    }
}
 
// inverse fft (in-place)
void ifft(CArray& x)
{
    // conjugate the complex numbers
    x = x.apply(std::conj);
 
    // forward fft
    fft( x );
 
    // conjugate the complex numbers again
    x = x.apply(std::conj);
 
    // scale the numbers
    x /= x.size();
}
 
int main()
{
	int t; // no. of test cases to try on
	std::cin>>t;
	while(t--)
	{
		int n; // n is for order of the polynomial
		std::cin>>n;
	    Complex test[n];
	    for (int i = 0; i < n; ++i)
	    {
	    	double real, imag;
	    	std::cin>>real>>imag; // reading each coefficient as a complex number
	    	test[i].real(real); // setting real part to real
	    	test[i].imag(imag); // and imaginary part to imaginary
	    }

	    CArray data(test, n);

	    ifft(data);
	 
	    for (int i = 0; i < n; ++i)
	    {
	        std::cout << std::fixed << std::setprecision(6) << data[i].real() << " " << data[i].imag() << std::endl;
	    }
	}
}