#include <iostream>
#include<vector>
#include<algorithm>
using namespace std;

int main()
{
    vector <int> a;
    int n;
    cout << "enter the number of numbers you want to input and want to display the smallest of them";
    cin >> n;
    for (int i = 0;i < n;i++)
    {
        int temp;
        cin >> temp;
        a.push_back(temp);

    }
    sort(a.begin(), a.end());
    cout << "smallest number is : " << a[0];
}
