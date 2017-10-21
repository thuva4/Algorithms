package main

import (
	"fmt"
	"log"
	"unicode/utf8"
)

func hammingDistance(str1, str2 string) (distance int) {

	// Str lengths must be the same
	if utf8.RuneCountInString(str1) != utf8.RuneCountInString(str2) {
		return -1
	}

	for i := 0; i < utf8.RuneCountInString(str1); i++ {
		if str1[i] != str2[i] {
			distance++
		}
	}
	return
}

func main() {

	var str1, str2 string
	fmt.Printf("Enter the first string: ")
	_, err := fmt.Scanln(&str1)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Enter the second string: ")
	_, err = fmt.Scanln(&str2)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(hammingDistance(str1, str2))
}
