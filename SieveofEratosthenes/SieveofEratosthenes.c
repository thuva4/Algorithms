#include <stdio.h>
#include <stdlib.h>

#define LIMIT 10000000 /*size of integers array*/

int main(){
    unsigned long long int i,j;
    int *primes;
    int z = 1;

    primes = malloc(sizeof(int)*LIMIT);

    for (i=2;i<limit;i++)
        primes[i]=1;

    for (i=2;i<limit;i++)
        if (primes[i])
            for (j=i;i*j<limit;j++)
                primes[i*j]=0;

    for (i=2;i<limit;i++)
        if (primes[i])
            printf("%dth prime = %dn",z++,i);

return 0;
}
