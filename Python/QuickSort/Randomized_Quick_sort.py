import random
import numpy as np

#from first_index to last_index, choose random num
def Randomized_Partition(A,start,end):
    i = random.randrange(start,end)
    temp = A[end]
    A[end] = A[i]
    A[i] = temp
    return Partition(A,start,end)


def Randomized_quicksort(A,start,end):
    if start < end:
        q = Partition(A, start, end)
        Randomized_quicksort(A, start, q-1)
        Randomized_quicksort(A, q+1, end)
    return A

def Partition(A,start,end):
    x = A[end]
    i = start -1
    for j in range(start, end):
        if A[j] <= x:
            i = i+ 1
            temp = A[i]
            A[i]= A[j]
            A[j] = temp
    temp2 = A[i + 1]
    A[i + 1] = A[end]
    A[end] = temp2
    return i + 1


unsorted = np.array([4,5,2,6,1,3,9,8,7])
print("Unsorted : ", [x for x in unsorted])
print("Sorted : \n")
print(Randomized_quicksort(unsorted, 0, len(unsorted) - 1))


