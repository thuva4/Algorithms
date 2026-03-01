package suffixtree

import "sort"

// SuffixTree counts distinct substrings using suffix array and LCP.
func SuffixTree(arr []int) int {
	n := len(arr)
	if n == 0 {
		return 0
	}
	sa := make([]int, n)
	rank := make([]int, n)
	tmp := make([]int, n)
	for i := 0; i < n; i++ {
		sa[i] = i
		rank[i] = arr[i]
	}
	for k := 1; k < n; k *= 2 {
		r := make([]int, n)
		copy(r, rank)
		step := k
		sort.Slice(sa, func(i, j int) bool {
			a, b := sa[i], sa[j]
			if r[a] != r[b] {
				return r[a] < r[b]
			}
			ra, rb := -1, -1
			if a+step < n { ra = r[a+step] }
			if b+step < n { rb = r[b+step] }
			return ra < rb
		})
		tmp[sa[0]] = 0
		for i := 1; i < n; i++ {
			tmp[sa[i]] = tmp[sa[i-1]]
			p0, c0 := r[sa[i-1]], r[sa[i]]
			p1, c1 := -1, -1
			if sa[i-1]+step < n { p1 = r[sa[i-1]+step] }
			if sa[i]+step < n { c1 = r[sa[i]+step] }
			if p0 != c0 || p1 != c1 { tmp[sa[i]]++ }
		}
		copy(rank, tmp)
		if rank[sa[n-1]] == n-1 { break }
	}
	invSa := make([]int, n)
	lcp := make([]int, n)
	for i := 0; i < n; i++ { invSa[sa[i]] = i }
	h := 0
	for i := 0; i < n; i++ {
		if invSa[i] > 0 {
			j := sa[invSa[i]-1]
			for i+h < n && j+h < n && arr[i+h] == arr[j+h] { h++ }
			lcp[invSa[i]] = h
			if h > 0 { h-- }
		} else { h = 0 }
	}
	total := n * (n + 1) / 2
	for _, v := range lcp { total -= v }
	return total
}
