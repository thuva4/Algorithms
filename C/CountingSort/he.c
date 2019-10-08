#include <stdio.h>

#define RANGE 256

void counting_sort(int *vec, int n) {
	// The array containing the result.
	int output[n];
	for(int i=0;i<n;i++) output[i] = 0;
	
	// The count array.
	int count[RANGE];
	for(int i=0;i<RANGE;i++) count[i] = 0;
	
	for (int i = 0; i < n; i++) {
		count[vec[i]]++;
	}
	
	// Make count[i] contain the start position of the element in the output array.
	for (int i = 1; i < RANGE; i++) {
		count[i] += count[i-1];
	}
	
	// Build the output array.
	for (int i = 0; i < n; i++) {
		output[count[vec[i]] - 1] = vec[i];
		count[vec[i]]--;
	}
	
	for (int i = 0; i < n; i++) {
		vec[i] = output[i];
	}
}

void print(int *test_vec, int n) {
	printf("{ ");
	for (int i = 0; i < n; i++) {
		printf("%d ",test_vec[i]);
		
	}
	printf("}\n");
}

int main() {
	// Testing.
	int test_vec[11] = {99, 122, 11, 2, 2, 3, 44, 33, 9, 0, 0};
	int n = sizeof(test_vec)/sizeof(int);
	
	printf("The array before sorting: ");
	print(test_vec, n);
	
	counting_sort(test_vec, n);
	
	printf("The sorted array: ");
	print(test_vec, n);
	
	return 0;
}