def day_of_week(year, month, day):
	t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4]
	year -= month < 3
	return (year + int(year/4) - int(year/100) + int(year/400) + t[month-1] + day) % 7
y = input("Enter Year: ")
m = input("Enter month: ")
d = input("Enter day: ")
n = (day_of_week(y,m,d))
if n == 0:
    print "Sunday"
elif n == 1:
    print "Monday"
elif n==2:
    print "Tuesday"
elif n==3:
    print "Wednesday"
elif n == 4:
    print "Thrusday"
elif n==5:
    print "Friday"
else:
    print "Saturday"
