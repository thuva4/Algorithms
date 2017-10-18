def gcd(a, b):
    """
       Calculates the GCD of the two parameters a and b. This method loops through all the numbers between 1 and
       the smaller number to calculate the GCD.
    """

    smallerNumber = a if a < b else b
    biggestFactor = 1
    temp = 0

    while temp < smallerNumber:
        temp += 1
        if a % temp == 0 and b % temp == 0:
            biggestFactor = temp

    return biggestFactor
