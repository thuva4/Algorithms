using System;

class UnaryCoding
{
    static string UnaryEncode(int n)
    {
        return new string('1', n) + "0";
    }

    static void Main(string[] args)
    {
        Console.WriteLine("Unary encoding of 0: " + UnaryEncode(0));
        Console.WriteLine("Unary encoding of 3: " + UnaryEncode(3));
        Console.WriteLine("Unary encoding of 5: " + UnaryEncode(5));
    }
}
