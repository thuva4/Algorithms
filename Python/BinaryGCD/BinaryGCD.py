import unittest

def gcd(a, b):
	if a == b:
		return a
	elif a == 0:
		return b
	elif b == 0:
		return a
	elif ~a & 1:
		if b & 1:
			return gcd(a >> 1, b)
		else:
			return gcd(u >> 1, v >> 1) << 1
	elif ~b & 1:
		return gcd(a, b >> 1)
	elif (a > b):
		return gcd((a - b) >> 1, b)
	else:
		return gcd((b -a) >> 1, a)
	

class TestSuite(unittest.TestCase):
	def test_gcd(self):
		self.assertEqual(3, gcd(258, 321))
		self.assertEqual(24, gcd(24, 0))
		self.assertEqual(7, gcd(0, 7))


if __name__ == "__main__":
	unittest.main()
