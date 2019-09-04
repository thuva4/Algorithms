#include <iostream>
#include <stdio.h>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

#define RANGE 256

void counting_sort(vector<int> &vec) {
	// The vector containing the result.
	vector<int> output(vec.size(), 0);
	
	// The count vector.
	vector<int> count(RANGE, 0);
	
	for (int i = 0; i < int(vec.size()); i++) {
		count[vec[i]]++;
	}
	
	// Make count[i] contain the start position of the element in the output vector.
	for (int i = 1; i < int(count.size()); i++) {
		count[i] += count[i-1];
	}
	
	// Build the output vector.
	for (int i = 0; i < int(vec.size()); i++) {
		output[count[vec[i]] - 1] = vec[i];
		count[vec[i]]--;
	}
	
	for (int i = 0; i < int(vec.size()); i++) {
		vec[i] = output[i];
	}
}

void print(vector<int> test_vec) {
	cout << "{ ";
	for (int i = 0; i < int(test_vec.size()); i++) {
		cout << test_vec[i] << " ";
		
	}
	cout << "}" << endl;
}

int main() {
	// Testing.
	vector<int> test_vec = {99, 122, 11, 2, 2, 3, 44, 33, 9, 0, 0};
	
	cout << "The vector before sorting: ";
	print(test_vec);
	
	counting_sort(test_vec);
	
	cout << "The sorted vector: ";
	print(test_vec);
	
	return 0;
}
