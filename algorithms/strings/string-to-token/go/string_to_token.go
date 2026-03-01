package stringtotoken

import "strings"

// tokenize splits text on a literal delimiter and omits empty tokens.
func tokenize(text, delimiter string) []string {
	if text == "" {
		return []string{}
	}
	if delimiter == "" {
		return []string{text}
	}

	parts := strings.Split(text, delimiter)
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		if part != "" {
			result = append(result, part)
		}
	}

	return result
}

// Tokenize is an exported alias for tokenize.
func Tokenize(text, delimiter string) []string {
	return tokenize(text, delimiter)
}
