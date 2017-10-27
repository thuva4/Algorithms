/*
********************************************************************************************************************************
* Algorithm 3 way mergeMergesort:
/*-----------------------------------------------------------------------------------
* <p> Title: Find Repeat Beast Mode </p>
*
* <p> Description: A program that returns the dublicate no in the given array.</p>
*
* @author Venkatesh Bejjenki
*------------------------------------------------------------------------------------

* Step 1 :	Take unMergesorted integer array pass to the mergeMergesort method.
* Step 2 :	In mergeMergesort method split the array in to 3 parts.
* Step 3 :	Copy the splited parts to three auxliary array.
* Step 4 :	Each auxilary array pass to the mergeMergesort method recursivly,untill array length is less than three and 
*			call the merge method recusively which is implemented in the next step.
* Step 5 :	Now implement a merge method with four parameters, three are auxilary 
*			arrays which are generated from mergeMergesort method and fourth parameter is orginal array.
* Step 6 :	In merge method if any of the three auxilary arrays length is less than
*			three then Mergesort the elements in accending order in respective auxilary array.
* Step 7 :	Take four indexes and initialize to zero, three for axuilary arrays and one for orginal array.
* Step 8 : 	Compare three indexes position value of axuilary arrays and take the minimum value, set in orginal array.
* Step 9 : 	Increment the index value of axuilary array which has minimum value among them and also incement the orginal array index.
* Step 10: 	After Mergesorting, merge method returns Mergesorted array.
* Step 11: 	After recursively calling the merge method in  mergeMergesort method. merge Mergesort method will return a Mergesorted array.
* Step 12: 	As we receive a Mergesorted array from merge Mergesort method to main method, print the Mergesorted array.
*********************************************************************************************************************************
*/

import java.util.Scanner;
public class Mergesort3Way {
	
	Mergesort3Way() {
		
	}
	
	public int[] merge(int[] left, int[] middle, int[] right, int[] orginal) {
		// Your code goes here
		//import java.util.Scanner;
		int x=0,y=0,z=0,index=0;
		while(x<left.length || y<middle.length || z<right.length){
			if(x<left.length && y<middle.length && z<right.length &&left[x]<middle[y] && left[x]<right[z]){
				orginal[index]=left[x];
				x++;index++;
			}
			else if (y<middle.length && z<right.length && middle[y]<right[z]) {
				orginal[index]=middle[y];
				y++;index++;
			}
			else if(z<right.length){
				orginal[index]=right[z];
				z++;index++;
			}
		
			if(x<left.length && y<middle.length){
				if(left[x]<middle[y]){
					orginal[index]=left[x];
					x++;index++;
				}
				else{
					orginal[index]=middle[y];
					y++;index++;
				}

			}
			if(x<left.length && z<right.length){
				if(left[x]<right[z]){
					orginal[index]=left[x];
					x++;index++;
				}
				else{
					orginal[index]=right[z];
					z++;index++;
				}

			}
			if(y<middle.length && z<right.length){
				if(middle[y]<right[z]){
					orginal[index]=middle[y];
					y++;index++;
				}
				else{
					orginal[index]=right[z];
					z++;index++;
				}

			}
			if (x<left.length){
				orginal[index]=left[x];
				x++;index++;
			}
			if (y<middle.length){
				orginal[index]=middle[y];
				y++;index++;
			}
			if (z<right.length){
				orginal[index]=right[z];
				z++;index++;
			}
			
		}
		
		return orginal;
	}
	
	public int[] mergeMergesort(int[] orginal) {
		int[] left;
		int[] right;
		int[] middle;

		int i;
		if(orginal.length==1)
			return orginal;
		else if(orginal.length==2){
				if(orginal[0]<orginal[1])
					return orginal;
				else{
					int temp=orginal[0];
					orginal[0]=orginal[1];
					orginal[1]=temp;
					return orginal;
				}
		}
		else{
			int reminder=orginal.length/3;
			if(orginal.length%2==0 && orginal.length!=4){
				reminder++;
			}
			left=new int[reminder];
			middle=new int[reminder];
			right=new int[orginal.length-2*reminder];
			for(i =0;i<reminder;i++){
				left[i]=orginal[i];
				System.out.println("left "+left[i]);
			}
			for(int j=0;j < reminder;j++,i++){
				middle[j]=orginal[i];
				System.out.println("middle"+middle[j]);
			}	
			for (int k=0;k<right.length ;k++,i++ ) {
				right[k]=orginal[i];	
				System.out.println("right"+right[k]);
			}
			left=mergeMergesort(left);
			middle=mergeMergesort(middle);
			right=mergeMergesort(right);
		}
		
		return merge(left, right, middle, orginal);
	}
	
	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		System.out.println("Enter the size of array.");
		int size = Integer.parseInt(sc.nextLine());
		int[] orginal = new int[size];
		for (int i = 0; i < size; i++) {
			System.out.println("Enter the " + (i+1) + "th number" );
			orginal[i] = Integer.parseInt(sc.nextLine());
		}
		Mergesort3Way ms = new Mergesort3Way();
		orginal = ms.mergeMergesort(orginal);
		System.out.println("Sorted array is: ");
		for (int i = 0; i < size; i++) {
			System.out.print(orginal[i]+" ");
		}
		System.out.println("Yahoo!!!! I did the Mergesort program....");
	}
}
