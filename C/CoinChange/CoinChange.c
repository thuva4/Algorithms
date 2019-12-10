#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int coin_set[5] = { 1, 5, 25, 100, 1000 };
#define coin_num 5
int size = 10;

int* CoinChange ( int change ){
	int* result, i, j = 0;
	result = (int *)malloc(size*4);
	int coin;

	for( i = 0; i < coin_num; i++ ){
		coin = coin_set[ coin_num - i -1 ];
		while( coin <= change ){
			result[j] = coin;
			j++;
			change = change - coin;
			if( j >= size ){
				result = (int*)realloc( result, size*4 );
				size = size * 2;
			}
		}
	
	}

	return result;	
}

int main(){
	int change = 186;
	int* result = CoinChange( change );
	for( int i = 0; i < size; i++)
		printf("%d ", result[i]);


}
