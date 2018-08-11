'use strict';
var fibonacci = (function (n) {
    var memory = [];
      memory[0] = 0;
      memory[1] = 1;
    return function innerFibonacci (n) {
          if (memory[n] === undefined) {
                  memory[n] = innerFibonacci(n - 2) + innerFibonacci(n - 1);
                }
          return memory[n];
        }
})();


console.log(fibonacci(20));

