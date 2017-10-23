#include "string.h"

int HammingDistance(char *str1, char *str2){
	int i;
	int dist = 0;

	if(str1 == NULL || str2 == NULL){
		return -1;
	}
	if(strlen(str1) != strlen(str2)){
		/*Strings must have the same length*/
		return -1;
	}

	for(i = 0; i < strlen(str1); i++){
		if(str1[i] != str2[i]){
			dist++;
		}
	}

	return dist;
}