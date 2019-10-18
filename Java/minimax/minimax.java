package mini_max;

import java.util.ArrayList;
import java.util.Scanner;

class Matrix{
	int[][] m;
	
	public Matrix()
	{}
	public Matrix(int[][] m)
	{
		this.m=m;
		
	}
}

class hello
{
	Scanner co = new Scanner(System.in);
	int a[][] = new int[][]{{-1,-1,-1},{-1,-1,-1},{-1,-1,-1},};
	
	Matrix n = new Matrix(a);
	
	int r=0,c=0;
	
	ArrayList<int[][]> al = new ArrayList<int[][]>();
	Matrix m=new Matrix();
	ArrayList<Matrix> al2=new ArrayList<>();
	
	public void accept()
	{
	
		for(int i=0;i<3;i++)
		{
			System.out.println("\n");
			for(int j=0;j<3;j++)
			{
				System.out.print(a[i][j]+"\t");
			}
		}
		
		
	   System.out.println("\nEnter the Row and Column for the move");
	   r=co.nextInt();
	   c=co.nextInt();
	   if(r>3 || r<0)
	   {
		   System.out.println("\nInvalid value of Row \n Reenter the value of Row ");
		   r=co.nextInt();
	   }
	  
	   if(c>3 || c<0)
	   {
		   System.out.println("\nInvalid value of Column \n Reenter the value of Column ");
		   c=co.nextInt();
	   }
	   
	   if(a[r][c]!=-1)
	   {
		   System.out.println("\n Position not empty");
	   }
	   
	   a[r][c]=1;
	}
	
	public void Display()
	{
		for(int i=0;i<3;i++)
		{
			System.out.println("\n");
			for(int j=0;j<3;j++)
			{
				System.out.print(a[i][j]+"\t");
			}
		}
	}
	
	public void comp()           //computers move
	{
		
		System.out.println("\nPlaying computers move");
		
		int ri=0,ci=0;
		// for all corner position
		if(a[0][0]==-1)
		{
			a[0][0]=0;
			ri=0;ci=0;
		}
		else
		{
			if(a[0][2]==-1)
			{
				a[0][2]=0;
				ri=0;ci=2;
			}
			else
			{
				if(a[2][0]==-1)
				{
					a[2][0]=0;
					ri=2;ci=0;
				}
				else
				{
					a[2][2]=0;
					ri=2;ci=2;
				}
			}
		}
		
		//al2.add(a);
		al2.add(new Matrix(a));
		Displaymatrix(m);
		
		System.out.println("\n"+al2.get(0));
		
		a[ri][ci]=-1;
		
		//for middle position
		if(a[1][1]==-1)
		{
			a[1][1]=0;
			ri=1;ci=1;
		}
		
        Display();
		al.add(a);
		System.out.println("\n"+al);
		
		a[ri][ci]=-1;
		
		//for other position
		if(a[0][1]==-1)
		{
			a[0][1]=0;
			ri=0;ci=1;
		}
		else
		{
			if(a[1][0]==-1)
			{
				a[1][0]=0;
				ri=1;ci=0;
			}
			else
			{
				if(a[2][1]==-1)
				{
					a[2][1]=0;
					ri=2;ci=1;
				}
				else
				{
					a[1][2]=0;
					ri=1;ci=2;
				}
			}
		}
		

        Display();
		al.add(a);
		System.out.println("\n"+al);
		
		a[ri][ci]=-1;
		
		System.out.println(al2);
	}
	
	public void evaluate()
	{
		int count=0,e0=0,e1=0;
		int ele=a[0][0];
		
		for(int i=0;i<3;i++)
		{
			for(int j=0;j<3;j++)
			{
				if(ele==0)
				{
				  if(ele!=a[i][j] && ele!=-1)
				  {  
					
					break;	
				  }
				}
				
				if(ele==1)
				{
				  if(ele!=a[i][j] && ele!=-1)
				  {  
					break;	
				  }
				}
			}
			count++;
		}
		
		if(count==2)
		{
			e0++;
		}
		
	}
	public void Displaymatrix(Matrix M)//to display matrix
	{
		for(int i=0;i<3;i++)
		{
			for(int j=0;j<3;j++)
			{
				System.out.print("|"+M.m[i][j]+" ");
			}
			System.out.print("|");
			System.out.println();
		}
		
	}
	
	
}



public class minimax {

	public static void main(String[] args) {
		
		hello h =new hello();
		h.accept();h.Display();
		h.comp();
		
	}

}
