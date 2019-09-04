/**
 * xorSwap
 * 
 * Swaps two variables without using a temporary variable
 * 
 */
function xorSwap()
{
  var a = 5, b = 10;	
  a = a ^ b;
  b = a ^ b;
  a = a ^ b;

  console.log("a = " + a + ", b = " + b);
}


