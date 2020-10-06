// C# program to find factorial 
// of given number 
using System; 
  
class Test { 
    // method to find factorial 
    // of given number 
    static int factorial(int n) 
    { 
        if (n == 0) 
            return 1; 
  
        return n * factorial(n - 1); 
    } 
  
    // Driver method 
    public static void Main() 
    { 
        int num = 5; 
        Console.WriteLine("Factorial of "
                          + num + " is " + factorial(5)); 
    } 
} 
