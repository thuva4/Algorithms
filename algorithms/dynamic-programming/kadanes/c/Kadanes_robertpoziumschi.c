#include <stdio.h>
#include <limits.h>

int main() {
	int v[] = {-2, -3, 4, -1, -2, 1, 5, -3};
	int currentMax = 0, globalMax = INT_MIN;
	int size = sizeof(v) / sizeof(v[0]);
	for (int i = 0; i < size; i ++) {
		currentMax += v[i];
		globalMax = globalMax < currentMax ? currentMax : globalMax;

		if (currentMax < 0) {
			currentMax = 0;
		}
	}
	printf("Max sum is %d\n", globalMax);
	return 0;
}