#include <iostream>
#include <string>

using namespace std;

int hammingDistance(const string str1, const string str2)
{
	//IF LENGTH BEETWEEN STRINGS IS DIFFERENT
	if(str1.length() != str2.length())
		return -1;
	else
	{
		int dist = 0;
		
		//COMPARE PARALLEL CHARACTERS
		for(unsigned i = 0; i < str1.length(); i++)
			//IF DIFFERENT, INCREMENT DISTANCE VARIABLE
			if(str1[i] != str2[i])
				++dist;
		
		return dist;
	}
		
}

int main()
{
	string str1, str2;
	
	//INPUT TWO STRINGS
	cout<<"Insert first string: ";
	cin>>str1;
	
	cout<<"Insert second string (of equal length): ";
	cin>>str2;
	
	//OUTPUT HAMMING DISTANCE
	cout<<"Hamming distance between these two strings (-1 if length is different): "<<hammingDistance(str1, str2)<<endl;
	
	return 0;
}
