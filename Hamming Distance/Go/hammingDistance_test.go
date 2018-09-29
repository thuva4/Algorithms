package hammingDistance

import "testing"

func TestHammingDistance(t *testing.T) {
	// "karolin" => "kathrin" is 3 according to Wikipedia
	if HammingDistance("karolin", "kathrin") != 3 {
		t.Fail()
	}
}