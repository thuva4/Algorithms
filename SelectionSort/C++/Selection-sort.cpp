#include<iostream>

using namespace::std;
void selection(int n, int a[20]){
    int k,i,temp,min;
    for(i=0; i<n-1; i++){
        min=i;
        for(k=i+1; k<n; k++){
            if(a[min]>a[k])
                min=k;
        }
            if(i!=min){
                temp=a[i];
                a[i]=a[min];
                a[min]=temp;
            }
    }
    cout<<"\t sorted list is \n";
    for(i=0;i<n;i++)
        cout<<"\t"<<a[i]<<"\t";
    cout<<"\n";
}

int main(){
    int a[20],i,j,k,n,temp,min;

    cout<<"\n enter size ";
    cin>>n;

    cout<<"\n enter elements ";

    for(i=0; i<n; i++)
        cin>>a[i];

    selection(n,a);

}
