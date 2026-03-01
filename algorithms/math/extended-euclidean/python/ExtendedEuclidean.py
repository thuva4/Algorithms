def gcdExtended(x, y):
    # Base Condition (Special Case)
    if x==0:
        return y,0,1
    # Call the function recursively
    gcd,x1,y1=gcdExtended(y%x,x)
    # Update x2 and y2 using the return of recursive function
    x2 = y1 - (y//x) * x1
    y2 = x1
    return gcd,x2,y2

# Can be modified to be taken as an input from the user
a = 60
b = 15
g,x,y=gcdExtended(a,b)
print("gcd(", a , "," , b, ") = ", g)
