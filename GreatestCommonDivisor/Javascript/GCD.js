/* Greatest Common Divisor (GCD) in JavaScript */

//Simple iterative function for GCD
function gcd(a, b) {
	while (true) {
        var remainder = a%b;
        if (remainder === 0) return b;

        a = b;
        b = remainder;
    }
}

//A recursive approach to GCD Implementation
function recursive_gcd(a, b) {
    if (b === 0) return a;

    return recursive_gcd(b, a%b);
}


/************ Testing GCD ***************/
console.log(gcd(5, 10));
console.log(gcd(14, 35));

console.log(recursive_gcd(5, 13));
console.log(recursive_gcd(24, 60));