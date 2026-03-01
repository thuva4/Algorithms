#include <cstdlib>
#include <iostream>
#include <unistd.h>
using namespace std;
//Program to demonstrate leaky bucket algorithm
int main()
{
	int bs,outr,ip,cbs=0,i;
	//Assign zero to current bucket size
	cout << "Enter Bucket Size and Output rate " << endl;
	cin >> bs >> outr;
	//input Bucket size and output rate
	cout << " Input Packet Current Bucket Output Discarded" << endl;
	for(i=0;i<200;i++)
	{
		ip=rand()%201;
		// random functions chooses the number randomly for input packet
		cbs+=ip;
		if(cbs>(bs+outr))
		{
			cout << ip<<"\t"<<bs<<"\t"<<outr<<"\t"<<cbs-(bs+outr)<<endl;
			cbs=bs;
		}
		else
		{
			if(cbs<outr)
			cout << ip<<"\t"<<cbs<<"\t"<<"0\t"<<"0"<<endl;
			else
			{
				cbs-=outr;
				cout << ip<<"\t"<<cbs<<"\t"<<outr<<"\t"<<"0"<<endl;
			}
			sleep(1);
		}
	}
	return 0;
}
