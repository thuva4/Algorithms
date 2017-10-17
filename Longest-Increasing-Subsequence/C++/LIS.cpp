/* BUILD : g++ FisherYatesShuffle.cpp -std=c++11*/

#include <iostream>
#include <vector>

using namespace std;

void LIS(vector<int> input)
{
    int input_length = input.size();
    int longest_length = 1;
    int longest_index = 0;

    vector<int> dp(input_length, 1);
    vector<int> trace(input_length, -1);
    vector<int> output;
    
    cout << "Input : " << input[0] << " ";
    for (int i = 1; i < input_length; i++)
    {
        cout << input[i] << " ";
        for (int j = 0; j < i; j++)
        {
            if (input[i] > input[j])
                if (dp[j] + 1 > dp[i])
                {
                    dp[i] = dp[j] + 1;
                    trace[i] = j;
                    if (dp[i] > longest_length)
                    {
                        longest_length = dp[i];
                        longest_index = i;
                    }
                }
        }
    }
    cout << endl;

    cout << "Longest length : " << longest_length << endl;
    cout << "Longest sequence : ";
    int i = longest_index;
    while (trace[i] != -1)
    {
        output.push_back(input[i]);
        i = trace[i];
    }
    output.push_back(input[i]);

    for (int i = output.size() - 1; i >= 0 ; i--)
        cout << output[i] << " ";
    cout << endl;
    cout << endl;
}

int main()
{
    vector<int> a {17,12,5,3,5,3,14,19,12,2};
    vector<int> b {9,12,2,7,18,9,9,13,6,19};
    vector<int> c {14,7,15,5,16,8,3,7,13,20};
    vector<int> d {12,4,19,3,6,20,11,3,15,9};
    vector<int> e {13,8,11,1,14,7,3,6,10,2};
    LIS(a);
    LIS(b);
    LIS(c);
    LIS(d);
    LIS(e);
    return 0;
}