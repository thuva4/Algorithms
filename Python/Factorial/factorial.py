number = int(input("Enter the number whose factorial you want: "))
if number < 0:
    print("Factorial of negative numbers cannot be computed!")

product = 1
for i in range(1, number+1):
    product = product*i


print(str(number) + "! = " + str(product))