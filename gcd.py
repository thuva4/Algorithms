print "Enter two element"
u = input()
v = input()

def gcd(u, v):

	if u == v:
		return u
	elif u == 0:
		return v
	elif v == 0:
		return u
	# u is even
	elif u & 1 == 0:
	# v is even
		if v & 1 == 0:
			return 2*gcd(u >> 1, v >> 1)
	# v is odd
		else:
			return gcd(u >> 1, v)
	# u is odd
	elif u & 1 != 0:
	# v is even
		if v & 1 == 0:
			return gcd(u, v >> 1)
	# v is odd and u is greater than v
	elif u > v and v & 1 != 0:
		return gcd((u-v) >> 1, v)
	# v is odd and u is smaller than v
	else:
		return gcd((v-u) >> 1, u)

k = gcd(u, v)
print k
