# This Program Checks if a Number is Prime or Not and Returns an Output. 

n = int(input("Number:"))
a = 0
for i in range(1,int(n/2)+1):
  if(n%i==0 and i!=1):
    break
  if(i == int(n/2)):
    a = 1
if(a==1):
  print("Number is Prime")
else:
  print("Number is Not A Prime")

# By KOTHA V V S AAKASH
