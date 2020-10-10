# Input the string
string = input("Enter the desired string: ")

# Input the delimiter
delimiter = input("Enter the desired delimiter: ")

# If delimiter is not set, make it a space by default
if(delimiter == ""):
    delimiter = " "

# Split the string based on the delimiter
tokenList = string.split(delimiter)

# Print the tokens list
for item in tokenList:
    print(item)
