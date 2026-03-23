using System;
public class Fibonacci
{
   public int cal(int number)
   {
     if (number <= 0)
     {
        return 0;
     }

     int a = 0, b = 1;
     for (int i = 1; i < number; i++)
     {
        int temp = a + b;
        a = b;
        b = temp;
     }

     return b;
   }
}
