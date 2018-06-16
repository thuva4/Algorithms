#include <iostream>
using namespace std;
int main(){
  int size;
  cout<<"Input Size:";
  cin>>size;
  int arr[size];
  cout<<"Input "<<size<<" elements:";
  for(int i=0;i<size;i++)
    cin>>arr[i];
  cout<<"Unsorted Array:"<<endl;
  for(int i=0;i<size;i++)
    cout<<arr[i]<<" ";
  cout<<endl;
  
  //bubble
  
  for(int i=0;i<size-1;i++){
    for(int j=i+1;j<size;j++){
      if(arr[i]>arr[j]){
        int t=arr[i];
        arr[i]=arr[j];
        arr[j]=t;
      }
    }
  }
  cout<<"Sorted Array:"<<endl;
  for(int i=0;i<size;i++)
    cout<<arr[i]<<" ";
  return 0;
}
