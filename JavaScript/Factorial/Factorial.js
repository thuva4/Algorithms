
function factorial(num) {
	if (num < 0) return -1;
	else if (num === 0 || num === 1)
  	      return 1;
	for (var i = num - 1; i >= 1; i--) {
	        num *= i;
	}
	return num;
}

console.log(factorial(5))   //120
console.log(factorial(0))   //1
console.log(factorial(-10)) //-1
