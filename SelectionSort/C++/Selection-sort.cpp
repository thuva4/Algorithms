#include <iostream>
#include <vector>

using namespace std;

void imprime(vector<int> lista)
{
    for(int i=0; i < lista.size();i++)
        cout<<lista[i]<<" ";
}

vector<int> SelectionSort(vector<int> data)
{
    int lon = data.size();

    for (int i = 0; i < lon; ++i)
    {
        int min = i;
        for (int j = i+1; j < lon; ++j)
        {
            if (data[j] < data[min])
            {
                min = j;
            }
        }

        if (min != i)
        {
            swap(data[i], data[min]);
        }
    }
    return data;
}

int main()
{
    vector<int> data;
    int num,tmp;

    cout<<"Number of elements: ";
    cin>>num;
    cout<<"Elements: "<<endl;
    for(int i=0; i<num;i++)
    {
        cin>>tmp;
        data.push_back(tmp);
    }

    //Selection sort
    cout<<endl<<"Selection sort"<<endl;
    vector<int> select = SelectionSort(data);
    imprime(select);
    cout<<endl;

    return 0;
}