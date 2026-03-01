def detect_cycle(arr):
    if not arr:
        return -1
    size = len(arr)
    
    tortoise = 0
    hare = 0
    
    while True:
        if tortoise < 0 or tortoise >= size or arr[tortoise] < 0 or arr[tortoise] >= size:
            return -1
        tortoise = arr[tortoise]
        
        if hare < 0 or hare >= size or arr[hare] < 0 or arr[hare] >= size:
            return -1
        hare = arr[hare]
        if hare < 0 or hare >= size or arr[hare] < 0 or arr[hare] >= size:
            return -1
        hare = arr[hare]
        
        if tortoise == hare:
            break
            
    tortoise = 0
    while tortoise != hare:
        tortoise = arr[tortoise]
        hare = arr[hare]
        
    return tortoise
