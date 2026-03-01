package main

import (
	"math"
	"math/rand"
)

//https://de.wikipedia.org/wiki/Diffie-Hellman-Schl%C3%BCsselaustausch#/media/Datei:Diffie-Hellman-Schl%C3%BCsselaustausch.svg
func diffiehellman() (int, int) {
	p := 9999971 //Large prime number
	g := 4       //Natural number, smaller than p

	//Alice secret
	a := rand.Intn(p)
	//Bobs secret
	b := rand.Intn(p)

	//Alice public key
	A := int(math.Pow(float64(g), float64(a))) % p
	//Bobs public key
	B := int(math.Pow(float64(g), float64(b))) % p

	/*
		Transmit A to Bob
		Transmit B to Alice
	*/

	//Shared key, calculated by Alice
	Ka := int(math.Pow(float64(B), float64(a))) % p
	//Shared key, calculated by Bob
	Kb := int(math.Pow(float64(A), float64(b))) % p

	return Ka, Kb
}
