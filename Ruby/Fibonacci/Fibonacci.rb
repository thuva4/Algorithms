#Returns the nth fibonacci number

#Iterative Algorithm
def fibonacci_iterative(n)
  num1 = 0
  num2 = 1
  (2..n+1).each { num1, num2 = num2, num1 + num2 }

  return num1
end

#Recursive Algorithm
def fibonacci_recursive(n)
  return n if n < 2
  return fibonacci_recursive(n-1) + fibonacci_recursive(n-2)
end