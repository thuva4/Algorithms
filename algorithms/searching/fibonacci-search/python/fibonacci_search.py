def fibonacci_search(arr, target):
    n = len(arr)
    if n == 0:
        return -1
        
    fibMMm2 = 0
    fibMMm1 = 1
    fibM = fibMMm2 + fibMMm1
    
    while fibM < n:
        fibMMm2 = fibMMm1
        fibMMm1 = fibM
        fibM = fibMMm2 + fibMMm1
        
    offset = -1
    
    while fibM > 1:
        i = min(offset + fibMMm2, n - 1)
        
        if arr[i] < target:
            fibM = fibMMm1
            fibMMm1 = fibMMm2
            fibMMm2 = fibM - fibMMm1
            offset = i
        elif arr[i] > target:
            fibM = fibMMm2
            fibMMm1 = fibMMm1 - fibMMm2
            fibMMm2 = fibM - fibMMm1
        else:
            return i
            
    if fibMMm1 == 1 and offset + 1 < n and arr[offset + 1] == target:
        return offset + 1
        
    return -1
