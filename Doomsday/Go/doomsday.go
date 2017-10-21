package main

import (
	"fmt"
	"log"
	"strconv"
)

func main() {

	weekdays := [7]string{"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	}
	const weeklength = 7
	const century = 100
	const year_cycle = 12
	const century_cycle = 4
	var year string
	fmt.Printf("Enter a year to find its doomsday: ")
	_, err := fmt.Scanln(&year)
	if err != nil {
		log.Fatal(err)
	}
	intyear, err := strconv.ParseInt(year, 0, 0)
  if err != nil {
    log.Fatal(err)
  }

  high_years := intyear/century
  r := high_years % century_cycle
  var anchor int64
  switch r {
  // Tuesday
  case 0:
    anchor = 2
  // Sunday
  case 1:
    anchor = 0
  // Friday
  case 2:
    anchor = 5
  // Wednesday
  case 3:
    anchor = 3
  }

  low_years := intyear % century
  a := low_years / year_cycle
  b := low_years % year_cycle
  c := b / century_cycle
  d := ( a + b + c ) % weeklength
  doomsday := ( anchor + d ) % weeklength
  fmt.Println(weekdays[doomsday])


}
