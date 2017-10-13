print("Enter the array:")
x = map(int, raw_input().split())

for i in range(len(x)):
    # Find the minimum element in remaining 
    # unsorted array
    min_idx = i
    for j in range(i+1, len(x)):
        if x[min_idx] > x[j]:
            min_idx = j 
    x[i], x[min_idx] = x[min_idx], x[i]
 
print ("Sorted array")
for i in range(len(x)):
    print("%d" %x[i]), 
