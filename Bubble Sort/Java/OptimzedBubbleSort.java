public class OptimzedBubbleSort {
      //n = length of array
      public static BubbleSort(int *arr, int n)
      {
          for(int i=0; i<n; i++)
          {  
            bool flag = false;
             for(int j=0; j<n-i-1; j++)
             {
                if(array[j]>array[j+1])
                {
                  flag = true;
                   int temp = array[j+1];
                   array[j+1] = array[j];
                   array[j] = temp;
                }
             }
            // No Swapping happened, array is sorted
            if(!flag){ 
               return; 
            } 
         }
      }
}
