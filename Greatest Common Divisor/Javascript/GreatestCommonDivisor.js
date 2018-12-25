function getGCD(a, b) {
  return (b == 0)? a : getGCD(b, a%b)
}

const readline = require('readline')


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


console.log('please enter 2 numbers');

rl.on('line', (a) => {

  if (!isNaN(a)) {

    rl.on('line', (b) => {
      if (!isNaN(b)) {
        console.log('GCD(' + a + ', ' + b + ') = ' + getGCD(a, b));
        rl.close()
      }

      else {
        console.log('please enter 2 NUMBERS');
      }

    })

  }

  else {
    console.log('That was not a number');
  }

})
