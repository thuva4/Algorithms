def interpolation_search(arr, target):
    lo = 0
    hi = len(arr) - 1
    
    while lo <= hi and target >= arr[lo] and target <= arr[hi]:
        if lo == hi:
            if arr[lo] == target:
                return lo
            return -1
            
        if arr[hi] == arr[lo]:
            if arr[lo] == target:
                return lo
            return -1
            
        pos = lo + int(((float(hi - lo) / (arr[hi] - arr[lo])) * (target - arr[lo])))
        
        if arr[pos] == target:
            return pos
            
        if arr[pos] < target:
            lo = pos + 1
        else:
            hi = pos - 1
            
    return -1
