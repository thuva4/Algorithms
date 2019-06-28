#include <stdio.h>
#include <string.h>

int HammingDistance(char *str1, char *str2)
{
	int i;
	int dist = 0;
	int LEN = strlen(str1);

	if(str1 == NULL || str2 == NULL){
		return -1;
	}
	if(LEN != strlen(str2)){
		/*Strings must have the same length*/
		return -1;
	}

	for(i = 0; i < LEN; i++){
		if(str1[i] != str2[i]){
			dist++;
		}
	}

	return dist;
}

int main(void)
{
	char* seq1 = "110110";
	char* seq2 = "111110";
	char* seq3 = "110000";
	printf("Test1 distance=%d\n", HammingDistance(seq1, seq1)); /* => 0 */
	printf("Test2 distance=%d\n", HammingDistance(seq1, seq2)); /* => 1 */
	printf("Test3 distance=%d\n", HammingDistance(seq1, seq3)); /* => 2 */
	return 0;
}