package bitreversal

func BitReversal(n int64) int64 {
	var val uint32 = uint32(n)
	var result uint32 = 0
	for i := 0; i < 32; i++ {
		result = (result << 1) | (val & 1)
		val >>= 1
	}
	return int64(result)
}
