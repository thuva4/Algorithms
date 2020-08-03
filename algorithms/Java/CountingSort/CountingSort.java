import java.util.Scanner;

class CountingSort
{
    public static void counting_sort(int a[], int range)
    {
        int c[] = new int[range]; // declare array for keeping count (frequency)
        for(int i = 1; i< range; i++) // initialise them to 0
            c[i] = 0;
            
        for(int i = 0; i<a.length; i++) // count the frequency of each number in range
            c[a[i]]++;
            
        int k=0;
        for(int i = 0; i< range; i++) // for each number in range
            for(int j = 0; j<c[i]; j++) // add the number as many times as its frequency
                a[k++] = i;
    }
	public static void main (String[] args)
	{
	    int n,range;
	    Scanner sc = new Scanner(System.in);
	    
	    n = sc.nextInt(); // number of elements to be sorted
	    range = sc.nextInt(); // range of the elements
	    
	    int a[] = new int[n];
	    //read the list to be sorted
	    for(int i = 0; i<n; i++)
	        a[i] = sc.nextInt();
	        
	    counting_sort(a,range); // perform counting sort
	    
	    // display the elements after sorting
	    for(int i = 0; i<n; i++)
	       System.out.print(a[i] + " ");
	}
}
