
def xor_switch(a,b):
    x = a
    y = b
    x = x ^ y
    y = y ^ x
    x = x ^ y
    return(x,y)

#Test case
j = 10
i = -10
while(i < 10):
    print("Original: ("+str(i)+", "+str(j)+")")
    print("Swapped: "+str(xor_switch(i,j)))
    j -= 1
    i += 1
