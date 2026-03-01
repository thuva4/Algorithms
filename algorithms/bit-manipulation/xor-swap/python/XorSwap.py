# Swaps two variables without using a temporary variable
def xorswap(a, b):
    a = a ^ b
    b = a ^ b
    a = a ^ b
    return a, b

a = 5
b = 10
a, b = xorswap(a, b)
print (a,b)