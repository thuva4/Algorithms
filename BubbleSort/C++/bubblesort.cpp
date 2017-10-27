#include <iostream>
using namespace std;
void printArra(int array[],int size);
void swap(int *a,int *b);

int main() {
	// your code goes here
	
	int items[]={3,2,5,8,10,1};
	int size = sizeof(items)/sizeof(items[0]);
	for(int i=0;i<size;i++){
	    for(int j=0;j<size-i-1;j++){
	        if(items[j]>items[j+1])
	         swap(&items[j],&items[j+1]);
	    }
	}
	printArra(items,size);
	
	return 0;
}

void printArra(int array[],int size){
    
    for(int i=0;i<size;i++){
        cout<<array[i]<<"\n";
    }
}


void swap(int *a,int *b){
    
    int temp = *a;
    *a = *b;
    *b = temp;
    
}
