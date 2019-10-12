# Recursive algorithm
def fibonacci_recursive(num):
    """ Calculate fibonacci number """
    if num == 0:
        return 0
    elif num in {1, 2}:
        return 1
    else:
        return fibonacci_recursive(num-1) + fibonacci_recursive(num - 2)

# Iterative algorithm
def fibonacci(num):
    """ Calculate fibonacci number (iterative function)"""
    nb1, nb2 = 0, 1

    for nbr in range(2 ,num+1):
        nb1, nb2 = nb2, nb1 + nb2

    return nb2

# Using Dynamic Programming
FibArray = [0,1]
def fibonacci(n):
    if n<0:
        print("Incorrect input")
    elif n<=len(FibArray):
        return FibArray[n-1]
    else:
        temp_fib = fibonacci(n-1)+fibonacci(n-2)
        FibArray.append(temp_fib)
        return temp_fib
print(fibonacci(9))
