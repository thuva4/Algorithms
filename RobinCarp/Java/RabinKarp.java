/*
 * Author:- Prarik Kayastha
 * Email-id:- pratikkayastha98@gmail.com
 * Program Name:- Rabin-Karp Algorithm
 * Description:- This algorithm uses to find pattern in given string.
 * Time-Complexity:- O(mn)
 * */

import java.util.Scanner;

public class RabinKarp {

	static final long prime = 101;
	public static String searchSubstring(String str,int n,String sub,int m)
	{
		long key= getSubKey(sub, m);
		long oldHash = getSubKey(str.substring(0, m), m);
		if(key==oldHash && equal(str, sub, 0))
			return "Yes";
		for(int i=m;i<n;i++)
		{
			oldHash = getNewHash(str, i-m, i, oldHash, m);
			if(key==oldHash && equal(str, sub, i-m+1))
				return "Yes";
		}
		return "No";
	}
	public static long getNewHash(String str,int oldIndex,int newIndex,long oldHash,int m)//get newhash in constant time
	{
		long newHash=((oldHash-str.charAt(oldIndex)+96)/prime)+((str.charAt(newIndex)-96)*(long)Math.pow(prime, m-1));
		return newHash;
	}
	public static long getSubKey(String sub,int m)//hashing function
	{
		long key=0;
		for(int i=0;i<m;i++)
		{
			key += (sub.charAt(i)-96)*(long)Math.pow(prime, i);
		}
		return key;
	}
	public static boolean equal(String str,String sub,int index)//to check two string are equal or not
	{
		for(int i=0;i<sub.length();i++)
			if(str.charAt(index+i)!=sub.charAt(i))
				return false;
		return true;
	}
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Scanner sc = new Scanner(System.in);
		String str = sc.nextLine();
		String sub = sc.nextLine();
		int n = str.length();
		int m = sub.length();
		System.out.println(searchSubstring(str,n,sub,m));
		sc.close();
	}

}
