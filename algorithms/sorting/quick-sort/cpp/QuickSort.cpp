#include <iostream>

using namespace std;

void quicksort(int num[21],int first,int last){
   int i, j, pivot, temp;

   if(first<last){
      pivot=first;
      i=first;
      j=last;

      while(i<j){
         while(num[i]<=num[pivot]&&i<last)
            i++;
         while(num[j]>num[pivot])
            j--;
         if(i<j){
            temp=num[i];
            num[i]=num[j];
            num[j]=temp;
         }
      }
      temp=num[pivot];
      num[pivot]=num[j];
      num[j]=temp;
      quicksort(num,first,j-1);
      quicksort(num,j+1,last);

   }
}

int main(){
   int i, count, num[21];

   cout<<"Enter the number of elements you wanna enter: ";
   cin>>count;

   cout<<"Enter your "<<count<<" elements: ";
   for(i=0;i<count;i++)
      cin>>num[i];

   quicksort(num,0,count-1);

   cout<<"Quick Sorted elements: ";
   for(i=0;i<count;i++)
      cout<<num[i]<<",";
   return 0;
}
