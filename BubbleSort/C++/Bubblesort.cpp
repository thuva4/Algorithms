#include <iostream>
#include <vector>

using namespace std;

void print(vector<int> lista)
{
    for(int i=0; i < lista.size();i++)
        cout<<lista[i]<<" ";
}

vector<int> BubbleSort( vector<int> data)
{
    int lon = data.size();

    for (int i = 0; i < lon; ++i)
    {
        bool swapped = false;
        for (int j = 0; j < lon - (i+1); ++j)
        {
            if (data[j] > data[j+1])
            {
                swap(data[j], data[j+1]);
                swapped = true;
            }
        }

        if (!swapped) break;
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

    //Bubble sort
    cout<<endl<<"Bubble sort"<<endl;
    vector<int> bubble = BubbleSort(data);
    print(bubble);

    cout<<endl;

    return 0;
}