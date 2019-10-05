# use Python 3 print function
# this allows this code to run on python 2.x and 3.x
 
# Variables Used
sharedPrime = 23    # p - prime
sharedBase = 5      # g - generator

aliceSecret = 6     # a
bobSecret = 15      # b

# Begin
print( "Publicly Shared Variables:")
print( "    Publicly Shared Prime: " , sharedPrime )
print( "    Publicly Shared Base:  " , sharedBase )

# Alice Sends Bob A = g^a mod p
A = (sharedBase**aliceSecret) % sharedPrime
print( "\n    Alice Sends Over Public Channel: " , A )

# Bob Sends Alice B = g^b mod p
B = (sharedBase ** bobSecret) % sharedPrime
print("    Bob Sends Over Public Channel: ", B )

print( "\n----------------------------------------\n" )
print( "Privately Calculated Shared Secret:" )
# Alice Computes Shared Secret: s = B^a mod p
aliceSharedSecret = (B ** aliceSecret) % sharedPrime
print( "    Alice Shared Secret: ", aliceSharedSecret )

# Bob Computes Shared Secret: s = A^b mod p
bobSharedSecret = (A**bobSecret) % sharedPrime
print( "    Bob Shared Secret: ", bobSharedSecret )
