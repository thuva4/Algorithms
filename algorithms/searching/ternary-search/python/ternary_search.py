def ternary_search(arr, target):
    l = 0
    r = len(arr) - 1
    
    while r >= l:
        mid1 = l + (r - l) // 3
        mid2 = r - (r - l) // 3
        
        if arr[mid1] == target:
            return mid1
        if arr[mid2] == target:
            return mid2
            
        if target < arr[mid1]:
            r = mid1 - 1
        elif target > arr[mid2]:
            l = mid2 + 1
        else:
            l = mid1 + 1
            r = mid2 - 1
            
    return -1
