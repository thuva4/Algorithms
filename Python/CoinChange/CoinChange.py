# coin change problem. 
  
def count_ways(arr, m, n ): 
    if (n == 0): 
        return 1
  
    if (n < 0): 
        return 0 
  
    if (m <=0 and n >= 1): 
        return 0
  
    return count_ways(arr, m - 1, n ) + count_ways(arr, m, n-arr[m-1])
  
temp_lst = [10, 30, 40] 
N = 100 # value for which we want to make change

print(count_ways(temp_lst, len(temp_lst), N))