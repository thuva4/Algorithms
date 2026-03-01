#include <iostream>
#include <vector>
#include <random>

using namespace std;

/* BUILD : g++ FisherYatesShuffle.cpp -std=c++11*/

/* initialize random seed: */
random_device rd;
mt19937 mt(rd());

void shuffle(vector<int> &a)
{
    int N = a.size();
    for (int i = N-1; i > 0; i--)
    {
        uniform_int_distribution<> distribution(0, i);
        int r = distribution(mt);
        swap(a[i], a[r]);
    }
}

int main()
{
    vector<int> a {0,1,2,3,4,5,6,7,8,9,10};

    for (int k = 0; k < 5; k++)
    {
        shuffle(a);
        for (int i = 0; i < a.size(); i++)
        {
            cout << a[i] << " ";
        }
        cout << endl;
    }
  
}