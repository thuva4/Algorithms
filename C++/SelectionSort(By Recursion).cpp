#include<iostream>
using namespace std;

void selectionSort(int arr[],int n,int index){

    if(index==n-1){
        return;
    }

    int min = arr[index];

    int minIndex = index;

    for(int i=index;i<n;i++){

        if(arr[i]<min){

            min = arr[i];

            minIndex = i;

        }

    }

    arr[minIndex] = arr[index];

    arr[index] = min;

    selectionSort(arr,n,index+1);

    return;

}

int main(){
int n;
cout<<"Enter size of array"<<endl;
cin>>n;
int arr[1000];
for(int i =0;i<n;i++){

    cin>>arr[i];
}

selectionSort(arr,n,0);

for(int i =0;i<n;i++){

    cout<<arr[i]<<" ";
}
cout<<endl;
}
