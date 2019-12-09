#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int binarysearch(int* dp, int low, int high, int num, int len){
        int mid;
	while( low <= high ){
		mid = (low + high)/2;
                if( dp[mid] < num ) low = mid + 1;
                else high = mid - 1;
        }
	if( dp[mid] < num && mid < len)
		return mid + 1;
        return mid; 
}

int LIS( int* nums, int length ){
	int len = 0, index;
       	int* dp;

	dp = (int*)malloc(length);
	for(int num = 0; num < length; num++){
		index = binarysearch(dp, 0, len, nums[num], len);
	     	printf("index: %d\n", index);
		dp[index] = nums[num];
               
		if( index == len ) len++;       
		for( int i = 0; i < length; i++ )
                        printf("%d ", dp[i]);
                puts("");

	}
	return len;
}

int main(){
	int nums[5] = {0, 8, 4, 12, 3};
	printf("LIS length: %d", LIS(nums, 5));
}
