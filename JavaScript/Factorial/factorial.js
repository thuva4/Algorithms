// Factorial Recursive Version
function Factorial(num) {
  if (num < 0) 
        return -1;
  else if (num == 0) 
      return 1;
  else {
      return (num * Factorial(num - 1));
  }
}

var input = 5;
var output = Factorial(input);
console.log(output);
