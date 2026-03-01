package primalitytests

func is_prime(n int) bool {
	if n <= 1 {
		return false
	}
	if n <= 3 {
		return true
	}
	if n%2 == 0 || n%3 == 0 {
		return false
	}

	for factor := 5; factor*factor <= n; factor += 6 {
		if n%factor == 0 || n%(factor+2) == 0 {
			return false
		}
	}

	return true
}
