import unittest

def HammingDistance(s1, s2):
	if len(s1) != len(s2):
		raise ValueError("ERROR: Strings must have the same length")
	return sum(c1 != c2 for c1, c2 in zip(s1, s2))

class TestSuite(unittest.TestCase):
	def test_hammingDistance(self):
		self.assertEqual(1, HammingDistance("110", "111"))
		self.assertEqual(0, HammingDistance("110", "110"))
		self.assertEqual(2, HammingDistance("11001", "11111"))

if __name__ == "__main__":
	unittest.main()