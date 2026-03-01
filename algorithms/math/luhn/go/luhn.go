package luhn

func luhn_check(number string) bool {
	if number == "" {
		return false
	}

	sum := 0
	doubleDigit := false

	for i := len(number) - 1; i >= 0; i-- {
		ch := number[i]
		if ch < '0' || ch > '9' {
			return false
		}

		digit := int(ch - '0')
		if doubleDigit {
			digit *= 2
			if digit > 9 {
				digit -= 9
			}
		}

		sum += digit
		doubleDigit = !doubleDigit
	}

	return sum%10 == 0
}
