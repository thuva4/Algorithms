def strand_sort(arr):
    if not arr:
        return arr
    
    items = arr[:]
    sorted_list = []
    
    while items:
        strand = [items.pop(0)]
        remaining = []
        
        for item in items:
            if item >= strand[-1]:
                strand.append(item)
            else:
                remaining.append(item)
        
        items = remaining
        sorted_list = merge(sorted_list, strand)
    
    # Copy back to original array
    for i in range(len(arr)):
        arr[i] = sorted_list[i]
        
    return arr

def merge(sorted_list, strand):
    result = []
    while sorted_list and strand:
        if sorted_list[0] <= strand[0]:
            result.append(sorted_list.pop(0))
        else:
            result.append(strand.pop(0))
    
    result.extend(sorted_list)
    result.extend(strand)
    return result
