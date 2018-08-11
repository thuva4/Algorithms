/*
 * Matheus Oliveira
 * 29/10/2017
 * lcm.cpp
 * 
 * Algorithm to find the lowest common multiple of two numbers,
 * using the algorithm to find the greatest common divisor.
 * 
*/

int gcd(int a, int b) {
	// euclidean algorithm to find gcd
	if(a == 0) return b;
	if(b == 0) return a;

	return gcd(b, a%b);
}

int lcm(int a, int b) {
	// the lcm of two numbers a and b is
	// the result of the operation a*b/gcd(a, b)
	return a*b/gcd(a, b);
}
