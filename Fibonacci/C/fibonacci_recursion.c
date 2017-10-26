/*
* C Program to print fibonacci series using recursion
*/
#include <stdio.h>
#include <conio.h>
 
int fibonacci(int term);
int main(){
    int terms, counter;
    printf("Enter number of terms in Fibonacci series: ");
    scanf("%d", &terms);
    /*
     *  Nth term = (N-1)th therm + (N-2)th term;
     */
    printf("Fibonacci series till %d terms\n", terms); 
    for(counter = 0; counter < terms; counter++){
        printf("%d ", fibonacci(counter));
    }
    getch();
    return 0;
}
/*
 * Function to calculate Nth Fibonacci number
 * fibonacci(N) = fibonacci(N - 1) + fibonacci(N - 2);
 */
int fibonacci(int term){
    /* Exit condition of recursion*/
    if(term < 2)
       return term;
    return fibonacci(term - 1) + fibonacci(term - 2);
}
