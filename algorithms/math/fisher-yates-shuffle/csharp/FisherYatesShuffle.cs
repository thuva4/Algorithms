using System;
class FisherYatesShuffle{
	static Random rnd;
	static void RandomShuffle(int[] a){
		//Shuffle (Fisher-Yates)
		for(int i=a.Length-1;i>0;i--){
			int idx=rnd.Next(i+1);
			int t=a[idx];
			a[idx]=a[i];
			a[i]=t;
		}
	}

	static void Main(){
		rnd=new Random();
		int n=10;
		int[] a=new int[n];
		for(int j=0;j<n;j++)a[j]=j;
		RandomShuffle(a);
		for(int j=0;j<n;j++)Console.Write(a[j]+(j<n-1 ? " ":"\n"));
	}
}
