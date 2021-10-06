//Rabin Karp Implementation in CPP
// Code by Jatin Dhall
#include <iostream>
#include <cmath>
using namespace std;

//Subtracting each character by 96 so that lowercase alphabets start from 1
int calculateHash(string pattern)//Function to calculate the hash value of the pattern
{
    int n = pattern.length();
    int hash = 0;
    for(int i=0;i<n;i++)
    {
        hash += ((pattern[i] - 96) * pow(10,(n-i-1))); // Formula to calculate the hash value while avoiding Spurious Hits
    }
    return hash;
}

int check(string substring, string pattern)//Function to check whether the characters are same bw the pattern and the substring
//(Substring is the string of length m, that had the same hash value as the pattern)
{
    for(int i=0;i<pattern.length();i++)
    {
        if(pattern.at(i) != substring.at(i))
        {
            return 0;
        }
    }
    return 1;
}

void search(string text,string pattern)//Function that conducts the pattern matching 
{
    int hash = calculateHash(pattern);
    int hash1;
    string substring;
    int n = text.length(),m = pattern.length();
    for(int i=0;i<n;i++)
    {
        hash1 = 0;
        substring = "";

        if(n - i < m){break;}//Checking if the remaining no. of characters is less thn the length of the pattern
        
        for(int j = 0; j<m;j++)//Calculating the hash value of the substring of length m from text
        {
            substring += text[i+j];
            hash1 += ((text[i + j] - 96) * pow(10,(m-j-1)));
        }
        if(hash == hash1) //If the hash value of the substring is the same as that of the pattern, then check each characters
        {
            int res = check(substring,pattern); // Check
            if(res == 1)
            {
                cout<<"Pattern found at : "<<i+1<<"'th Position"<<endl;
            }
        }
    }
}

int main()
{
    string text,pattern;
    cout<<"Enter the text : ";
    cin>>text;
    cout<<"Enter the pattern : ";
    cin>>pattern;
    search(text,pattern);
    
}