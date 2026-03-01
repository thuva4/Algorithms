def postman_sort(arr):
    if not arr:
        return arr
        
    min_val = min(arr)
    offset = 0
    
    if min_val < 0:
        offset = abs(min_val)
        for i in range(len(arr)):
            arr[i] += offset
            
    max_val = max(arr)
    
    exp = 1
    while max_val // exp > 0:
        counting_sort(arr, exp)
        exp *= 10
    
    if offset > 0:
        for i in range(len(arr)):
            arr[i] -= offset
            
    return arr

def counting_sort(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    
    for i in range(n):
        index = (arr[i] // exp)
        count[index % 10] += 1
        
    for i in range(1, 10):
        count[i] += count[i - 1]
        
    i = n - 1
    while i >= 0:
        index = (arr[i] // exp)
        output[count[index % 10] - 1] = arr[i]
        count[index % 10] -= 1
        i -= 1
        
    for i in range(n):
        arr[i] = output[i]
