# A recursive randomized binary search function.  
# It returns location of x in  
# given array arr[l..r] is present, otherwise -1  

import random 
def getRandom(x,y): 
    tmp=(x + random.randint(0,100000) % (y-x+1)) 
    return tmp 
  
def randomizedBinarySearch(arr,l,r,x) : 
    if r>=l: 
         
        mid=getRandom(l,r) 
          
        if arr[mid] == x: 
            return mid 
              
        if arr[mid]>x: 
            return randomizedBinarySearch(arr, l, mid-1, x) 
              
        return randomizedBinarySearch(arr, mid+1,r, x) 
         
    return -1
      
          
