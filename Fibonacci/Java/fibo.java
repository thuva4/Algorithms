import java.util.*;

class fibo
{
public static void main(String args[])
{
Scanner sc= new Scanner(System.in);
System.out.println("Enter the number of terms:");
int noTerms=sc.nextInt();
int a=0,b=1,c;
System.out.println("Fibonacci Series:");
for(int i=0;i<noTerms;i++)
{
System.out.print(a+"    ");
c=a+b;
a=b;
b=c;
}
}
}