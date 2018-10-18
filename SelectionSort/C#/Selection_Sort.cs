using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Selection_Sort
{
    class Program
    {
        static void Main(string[] args)
        {
            Selection_Sort selection = new Selection_Sort(10);
            selection.Sort();
        }
    }

    class Selection_Sort
    {
        private int[] data;
        private static Random generator = new Random();
        //Create an array of 10 random numbers
           public Selection_Sort(int size)
        {
            data = new int[size];
            for (int i = 0; i < size; i++)
            {
                data[i] = generator.Next(20, 90);
            }
        }

        public void Sort()
        {
            Console.Write("\nSorted Array Elements :(Step by Step)\n\n");
			display_array_elements();
			int smallest; 
            for (int i = 0; i < data.Length - 1; i++)
            {
                smallest = i;

                for (int index = i + 1; index < data.Length; index++)
                {
                    if (data[index] < data[smallest])
                    {
                        smallest = index;
                    }
                }
                Swap(i, smallest);
                display_array_elements();
		   }
            	
        }

        public void Swap(int first, int second)
        {
            int temporary = data[first];    
            data[first] = data[second];  
            data[second] = temporary;  
        }  

        public void display_array_elements()
        {        
            foreach (var element in data)
            {
                Console.Write(element + " ");
            }
            Console.Write("\n\n");
        }
    }
}
