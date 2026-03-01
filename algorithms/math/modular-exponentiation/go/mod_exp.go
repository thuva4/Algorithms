package modularexponentiation

func ModExp(arr []int) int {
	base := int64(arr[0])
	exp := int64(arr[1])
	mod := int64(arr[2])
	if mod == 1 {
		return 0
	}
	result := int64(1)
	base = base % mod
	for exp > 0 {
		if exp%2 == 1 {
			result = (result * base) % mod
		}
		exp >>= 1
		base = (base * base) % mod
	}
	return int(result)
}
