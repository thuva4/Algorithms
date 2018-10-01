#include "stdlib.h"
int LinearSearch(int *array, int len, int key){
	int i;

	if(array == NULL){
		return -1;
	}

	for(i = 0; i < len; i++){
		if(array[i] == key){
			return i;
		}
	}

	return -1;
}