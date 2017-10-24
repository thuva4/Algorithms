import java.util.*;

class fiborecursion
{
public static void main(String args[])
{
Scanner sc=new Scanner(System.in);
System.out.println("Enter the number of terms:");
int noTerms=sc.nextInt();
System.out.println("Fibonaci series:");
for(int i=0;i<noTerms;i++)
{
System.out.print("    "+fibo(i));
}
}
public static int fibo(int n)
{
if(n==0)
	return 0;
if(n==1)
	return 1;
else 
	return fibo(n-1)+fibo(n-2);
}
}