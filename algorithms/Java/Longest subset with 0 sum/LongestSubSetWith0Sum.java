//A Java program to find maximum length subarray with 0 sum 

import java.io.*;
import java.util.*; 

class LongestSubSetWithZeroSum { 
	
	public static void main(String arg[]) throws IOException 
	{ 
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in)); 
        int t = Integer.parseInt(br.readLine());	//read test case
    	while(t-->0)
    	{
    	   String str=br.readLine();	//read size of array
    		String[] starr=str.split(" ");
    	    int n=Integer.parseInt(starr[0]);
    		int[] arr=new int[n];
    		String str1=br.readLine();	//read array ex. (4, 2, -3, 1, 6)
    		String[] starr1=str1.split(", ");
    		for(int j=0;j<n;j++)
    		{
    		  arr[j]= Integer.parseInt(starr1[j]);
    		}
    		System.out.println("Length of the longest subarray with 0 sum is: \n"
					+ maxLen(arr));
    	}
	}

	// Returns length of the maximum length subarray with 0 sum 
	static int maxLen(int arr[]) 
	{
		HashMap<Integer, Integer> hM = new HashMap<Integer, Integer>(); 

		int sum = 0;
		int max_len = 0;

		for (int i = 0; i < arr.length; i++) {
			sum += arr[i]; 

			if (arr[i] == 0 && max_len == 0) {
				max_len = 1;
			}
			if (sum == 0) {
				max_len = i + 1;
			}
			Integer prev_i = hM.get(sum);
			if (prev_i != null) {
				max_len = Math.max(max_len, i - prev_i);
			}
			else {
				hM.put(sum, i); 
			}
		} 
		return max_len; 
	} 
}
